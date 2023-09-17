import { EntityRepository, Loaded, QueryOrder, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Role, User } from 'src/entities';
import { UserDTO } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
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

  async listByPage(
    pageNumber: number,
    sortField: string,
    sortDir: string,
    keyword: string,
    limit: number,
  ) {
    try {
      if (pageNumber < 1) {
        throw new BadRequestException('Invalid page number');
      }

      const fields = ['id', 'googleId', 'email', 'firstName', 'role'];

      if (!fields.includes(sortField) && sortField !== undefined) {
        throw new BadRequestException(
          'sortField must be one of the following values: id, googleId, email, firstName, role',
        );
      }
      if (sortField === undefined) sortField = 'id';

      const dirs = ['asc', 'desc', undefined];
      if (!dirs.includes(sortDir)) {
        throw new BadRequestException(
          'sortDir must be one of the following values: asc, desc',
        );
      }
      if (sortDir === undefined) sortDir = 'asc';

      if (limit < 1) {
        throw new BadRequestException('Invalid limit');
      }
      if (limit === undefined) limit = 5;
      const offset = (pageNumber - 1) * limit;

      const orderBy = {};
      orderBy[sortField] =
        sortDir === 'desc' ? QueryOrder.DESC : QueryOrder.ASC;

      if (keyword === undefined) keyword = '';
      const query = {};

      // Xây dựng mảng các điều kiện tìm kiếm cho từng trường
      const searchConditions = fields.map((field) => ({
        [field]: { $like: `%${keyword}%` },
      }));

      // Tạo một điều kiện $or để kết hợp tất cả điều kiện tìm kiếm
      query['$or'] = searchConditions;

      const users = await this.userRepository.findAndCount(query, {
        offset,
        limit,
        orderBy,
      });
      return users[0];
    } catch (error) {
      throw error;
    }
  }

  async addUser(userDto: UserDTO) {
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
        (await this.duplicatedEmail(updateUserDto.phone_number))
      ) {
        throw new BadRequestException('Phone number is already in use');
      }

      if (
        updateUserDto.email !== undefined &&
        userEntity.email !== updateUserDto.email &&
        !(await this.duplicatedEmail(updateUserDto.email))
      ) {
        throw new BadRequestException('Email cannot be changed');
      }

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
      const userToDelete = await this.userRepository.count({ id });
      if (!userToDelete) {
        throw new BadRequestException(`Can not find user with id: ${id}`);
      }

      await this.em.removeAndFlush(this.userRepository.getReference(id));
    } catch (error) {
      throw error;
    }
  }
}
