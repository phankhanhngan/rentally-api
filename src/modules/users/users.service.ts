import { EntityRepository, Loaded, QueryOrder, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Role, User } from 'src/entities';
import { UserDTO } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { FilterMessageDTO } from '../../common/dtos/EntityFillter.dto';
import { AWSService } from '../aws/aws.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly awsService: AWSService,
  ) {}

  async hashPassword(password: string) {
    const saltRounds = 10; // Số lần lặp để tạo salt, thay đổi tùy ý
    return bcrypt.hash(password, saltRounds);
  }

  async duplicatedEmail(email: string) {
    const user = await this.userRepository.findOne({ email: email });
    if (user === null) return false;
    return true;
  }

  async duplicatedPhoneNumber(phone_number: string) {
    const user = await this.userRepository.findOne({
      phone_number: phone_number,
    });
    if (user === null) return false;
    return true;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id: id });
    if (user == null) throw new Error(`Can not find user with id: ${id}`);
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email: email });
    if (user == null) throw new Error(`Can not find user with email: ${email}`);
    return user;
  }

  async listByPage(filterMessageDto: FilterMessageDTO) {
    try {
      const offset = (filterMessageDto.pageNo - 1) * filterMessageDto.limit;

      const orderBy = {};
      orderBy[filterMessageDto.sortField] =
        filterMessageDto.sortDir === 'desc' ? QueryOrder.DESC : QueryOrder.ASC;

      if (filterMessageDto.keyword === undefined) filterMessageDto.keyword = '';
      const query = {};

      // Xây dựng mảng các điều kiện tìm kiếm cho từng trường
      const fields = [
        'id',
        'googleId',
        'email',
        'firstName',
        'role',
        'phone_number',
      ];
      const searchConditions = fields.map((field) => ({
        [field]: { $like: `%${filterMessageDto.keyword}%` },
      }));

      // Tạo một điều kiện $or để kết hợp tất cả điều kiện tìm kiếm
      query['$or'] = searchConditions;

      const users = await this.userRepository.findAndCount(query, {
        offset,
        limit: filterMessageDto.limit,
        orderBy,
      });
      const usersDto = plainToClass(UserDTO, users[0]);
      return {
        users: usersDto,
        totalItems: users[1],
        totalPages: Math.ceil(users[1] / filterMessageDto.limit),
        currentPage: filterMessageDto.pageNo,
      };
    } catch (error) {
      throw error;
    }
  }

  async addUser(
    userDto: UserDTO,
    files: Array<Express.Multer.File> | Express.Multer.File,
  ) {
    console.log(files);
    
    try {
      if (await this.duplicatedEmail(userDto.email)) {
        throw new BadRequestException('Email is already in use');
      }
      if (
        userDto.phone_number !== undefined &&
        (await this.duplicatedPhoneNumber(userDto.phone_number))
      ) {
        throw new BadRequestException('Phone number is already in use');
      }
      const user = plainToInstance(User, userDto);

      if(userDto.photo !== undefined) {
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        const urlImages: string[] = await this.awsService.bulkPutObject(
          `QRImages/${timestamp}`,
          files,
        );
        const qrImagesUrl = JSON.stringify(urlImages);
        user.photo = qrImagesUrl;
      }

      user.password = await this.hashPassword(user.password);
      if (user.role === undefined) user.role = Role.USER;
      const create_id = userDto.idLogin === undefined ? 0 : userDto.idLogin;
      user.created_id = create_id;
      user.updated_id = create_id;

      await this.em.persistAndFlush(user);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(updateUserDto: UpdateUserDTO) {
    try {
      try {
        await this.getUserById(updateUserDto.idLogin);
      } catch (error) {
        throw new BadRequestException(
          `Can not find user login with id: ${updateUserDto.idLogin}`,
        );
      }

      const userEntity: Loaded<User> = await this.userRepository.findOne({
        id: updateUserDto.id,
      });
      if (!userEntity) {
        throw new BadRequestException(
          `Can not find user with id: ${updateUserDto.id}`,
        );
      }

      if (
        updateUserDto.phone_number !== undefined &&
        userEntity.phone_number !== updateUserDto.phone_number &&
        (await this.duplicatedPhoneNumber(updateUserDto.phone_number))
      ) {
        throw new BadRequestException('Phone number is already in use');
      }

      if (
        updateUserDto.email !== undefined &&
        userEntity.email !== updateUserDto.email
      ) {
        throw new BadRequestException('Email cannot be changed');
      }
      if (updateUserDto.password !== undefined)
        updateUserDto.password = await this.hashPassword(
          updateUserDto.password,
        );
      wrap(userEntity).assign(
        {
          ...updateUserDto,
          updated_at: new Date(),
          updated_id: updateUserDto.idLogin,
        },
        { updateByPrimaryKey: false },
      );

      await this.em.persistAndFlush(userEntity);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number) {
    try {
      const userToDelete = await this.userRepository.findOne({ id });
      if (!userToDelete) {
        throw new BadRequestException(`Can not find user with id: ${id}`);
      }
      if (userToDelete.photo !== undefined) {
        await this.awsService.bulkDeleteObject(
          JSON.parse(userToDelete.photo),
        );
      }

      await this.em.removeAndFlush(this.userRepository.getReference(id));
    } catch (error) {
      throw error;
    }
  }
}
