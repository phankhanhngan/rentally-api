import { EntityRepository, Loaded, QueryOrder, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, NotFoundException, UsePipes } from '@nestjs/common';
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
    try {
      const saltRounds = 10; // Số lần lặp để tạo salt, thay đổi tùy ý
      return bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw error;
    }
  }

  async duplicatedEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({ email: email });
      if (!user) return false;
      return true;
    } catch (error) {
      throw error;
    }
  }

  async duplicatedPhoneNumber(phone_number: string) {
    try {
      const user = await this.userRepository.findOne({
        phone_number: phone_number,
      });
      if (!user) return false;
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ id: id });
      if (!user)
        throw new NotFoundException(`Can not find user with id: ${id}`);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ email: email });
      if (!user)
        throw new NotFoundException(`Can not find user with email: ${email}`);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async listByPage(filterMessageDto: FilterMessageDTO) {
    try {
      const fields = [
        'id',
        'googleId',
        'email',
        'firstName',
        'role',
        'phone_number',
      ];
      const offset = (filterMessageDto.pageNo - 1) * filterMessageDto.limit;

      if (!Array.isArray(filterMessageDto.sortField)) {
        filterMessageDto.sortField = [filterMessageDto.sortField];
      }
      filterMessageDto.sortField.forEach((field) => {
        if (!fields.includes(field))
          throw new BadRequestException(
            'sortField must be one of id, googleId, email, firstName, role, phone_number',
          );
      });

      const orderBy = {};
      filterMessageDto.sortField.forEach((field) => {
        orderBy[field] =
          filterMessageDto.sortDir === 'desc'
            ? QueryOrder.DESC
            : QueryOrder.ASC;
      });

      if (filterMessageDto.keyword === undefined) filterMessageDto.keyword = '';
      const query = {};

      // Xây dựng mảng các điều kiện tìm kiếm cho từng trường
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
      const usersDto = plainToClass(UserDTO, users[0], {
        excludePrefixes: ['password'],
      });
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

  async addUser(userDto: UserDTO, file: Express.Multer.File) {
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

      if (file !== undefined) {
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        const photo: string = await this.awsService.bulkPutObject(
          file,
          `photo_user/${timestamp}`,
        );
        user.photo = photo;
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

  async updateUser(id: number, updateUserDto: UpdateUserDTO, file: Express.Multer.File) {
    try {
      try {
        await this.getUserById(updateUserDto.idLogin);
      } catch (error) {
        throw new BadRequestException(
          `Can not find user login with id: ${updateUserDto.idLogin}`,
        );
      }

      const userEntity: Loaded<User> = await this.userRepository.findOne({
        id: id,
      });
      if (!userEntity) {
        throw new BadRequestException(
          `Can not find user with id: ${id}`,
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

      if (file !== undefined) {
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        const photo: string = await this.awsService.bulkPutObject(
          file,
          `photo_user/${timestamp}`,
        );
        updateUserDto.photo = photo;
      }
      if (userEntity.photo !== null) {
        await this.awsService.bulkDeleteObject(userEntity.photo);
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
      const userToDelete = await this.getUserById(id);

      if (userToDelete.photo !== null) {
        await this.awsService.bulkDeleteObject(userToDelete.photo);
      }

      await this.em.removeAndFlush(this.userRepository.getReference(id));
    } catch (error) {
      throw error;
    }
  }
}
