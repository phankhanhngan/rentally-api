import { EntityRepository, Loaded, QueryOrder, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entities';
import { UserDTO } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { FilterMessageDTO } from '../../common/dtos/EntityFillter.dto';
import { AWSService } from '../aws/aws.service';
import { Role, UserStatus } from 'src/common/enum/common.enum';

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
      const count = await this.em.count('User', { email: email });
      if (count < 1) return false;
      return true;
    } catch (error) {
      throw error;
    }
  }

  async duplicatedPhoneNumber(phoneNumber: string) {
    try {
      const count = await this.em.count('User', { phoneNumber: phoneNumber });
      if (count < 1) return false;
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

  async getUsers(keyword: String) {
    try {
      const fields = [
        'id',
        'googleId',
        'email',
        'firstName',
        'lastName',
        'role',
        'phoneNumber',
      ];

      if (!keyword) keyword = '';
      const query = {};

      // Xây dựng mảng các điều kiện tìm kiếm cho từng trường
      const searchConditions = fields.map((field) => ({
        [field]: { $like: `%${keyword}%` },
      }));

      // Tạo một điều kiện $or để kết hợp tất cả điều kiện tìm kiếm
      query['$or'] = searchConditions;

      const users = await this.userRepository.findAndCount(query);
      const usersDto = plainToClass(UserDTO, users[0], {
        excludePrefixes: ['password', 'verificationCode'],
      });
      return usersDto;
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
        'lastName',
        'role',
        'phoneNumber',
      ];
      const offset = (filterMessageDto.pageNo - 1) * filterMessageDto.limit;

      if (!Array.isArray(filterMessageDto.sortField)) {
        filterMessageDto.sortField = [filterMessageDto.sortField];
      }
      filterMessageDto.sortField.forEach((field) => {
        if (!fields.includes(field))
          throw new BadRequestException(
            'sortField must be one of id, googleId, email, firstName, lastName, role, phoneNumber',
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
        excludePrefixes: ['password', 'verificationCode'],
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

  async addUser(
    userDto: UserDTO,
    file: Express.Multer.File,
    idlogin: number,
    status: UserStatus = UserStatus.ACTIVE,
  ) {

    try {
      if (await this.duplicatedEmail(userDto.email)) {
        throw new BadRequestException('Email is already in use');
      }
      if (
        userDto.phoneNumber &&
        (await this.duplicatedPhoneNumber(userDto.phoneNumber))
      ) {
        throw new BadRequestException('Phone number is already in use');
      }

      const user = plainToInstance(User, userDto);

      if (file) {
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        const photo: string = await this.awsService.bulkPutObject(
          file,
          `photo_user/${timestamp}`,
        );
        user.photo = photo;
      } else {
        user.photo = 'https://image-user-public.s3.ap-southeast-2.amazonaws.com/photo_user/user.png';
      }

      user.password = await this.hashPassword(user.password);
      if (!user.role) user.role = Role.USER;
      const create_id = idlogin === undefined ? 0 : idlogin;
      user.created_id = create_id;
      user.updated_id = create_id;
      user.status = status;
      await this.em.persistAndFlush(user);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDTO,
    file: Express.Multer.File,
    idlogin: number
  ) {
    try {
      const userEntity: Loaded<User> = await this.userRepository.findOne({
        id: id,
      });
      if (!userEntity) {
        throw new BadRequestException(`Can not find user with id: ${id}`);
      }

      if (
        updateUserDto.phoneNumber &&
        userEntity.phoneNumber !== updateUserDto.phoneNumber &&
        (await this.duplicatedPhoneNumber(updateUserDto.phoneNumber))
      ) {
        throw new BadRequestException('Phone number is already in use');
      }

      if (updateUserDto.email && userEntity.email !== updateUserDto.email) {
        throw new BadRequestException('Email cannot be changed');
      }

      if (file) {
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        const photo: string = await this.awsService.bulkPutObject(
          file,
          `photo_user/${timestamp}`,
        );
        updateUserDto.photo = photo;
      }
      if (userEntity.photo) {
        await this.awsService.bulkDeleteObject(userEntity.photo);
      }

      if (updateUserDto.password)
        updateUserDto.password = await this.hashPassword(
          updateUserDto.password,
        );

      wrap(userEntity).assign(
        {
          ...updateUserDto,
          updated_at: new Date(),
          updated_id: idlogin,
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
