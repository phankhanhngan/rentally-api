import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from 'src/entities';
import { UserDTO } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Số lần lặp để tạo salt, thay đổi tùy ý
    return bcrypt.hash(password, saltRounds);
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id: id });
    if (user == null) throw new Error(`User with ID ${id} not found`);
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email: email });
    if (user == null) throw new Error(`User with Email "${email}" not found`);
    return user;
  }

  async duplicatedEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ email: email });
    if (user == null) return false;
    return true;
  }

  async getDataResponse(message: string, status: string, data): Promise<{}> {
    var dataResponse = {};
    dataResponse = {
      message: message,
      status: status,
      data: data,
    };
    return dataResponse;
  }

  async getUser(id: number): Promise<{}> {
    try {
      const user = await this.getUserById(id);
      return await this.getDataResponse(`Found User with ID ${id}`, 'OK', user);
    } catch (error) {
      return await this.getDataResponse(error.message, 'Failed', []);
    }
  }

  async getAllUser(): Promise<{}> {
    return await this.getDataResponse(
      'Get all User successfully',
      'OK',
      await this.userRepository.findAll(),
    );
  }

  async searchUser(txt: string): Promise<{}> {
    const users = await this.userRepository.findAll();
    const searchedUsers = [];
    users.forEach((element) => {
      if (
        element.email.includes(txt) ||
        element.firstName.includes(txt) ||
        (element.lastName !== null && element.lastName.includes(txt)) ||
        (element.phone_number !== null && element.phone_number.includes(txt))
      ) {
        searchedUsers.push(element);
      }
    });
    return await this.getDataResponse(
      `Search User with "${txt}" success`,
      'OK',
      searchedUsers,
    );
  }

  async addUser(id: number, user: UserDTO): Promise<{}> {
    const newUser = new User();
    newUser.googleId = user.googleId;
    newUser.email = user.email;
    newUser.password = (await this.hashPassword(user.password)).toString();
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.photo = user.photo;
    newUser.phone_number = user.phone_number;
    newUser.role = user.role;
    newUser.created_id = id;
    newUser.updated_id = id;

    if (user.id === 0) {
      if (await this.duplicatedEmail(user.email)) {
        return await this.getDataResponse(
          'Email is already in use',
          'Failed',
          user,
        );
      }
    }

    try {
      await this.em.persistAndFlush(newUser);
    } catch (error) {
      return await this.getDataResponse(error.message, 'Failed', user);
    }
    return await this.getDataResponse(
      'Add Successfully!',
      'OK',
      await this.userRepository.findOne({ email: user.email }),
    );
  }

  async updateUser(id: number, user: UserDTO): Promise<{}> {
    try {
      const userToUpdate = await this.getUserById(user.id);
      userToUpdate.googleId = user.googleId;
      userToUpdate.email = user.email;
      userToUpdate.password = (
        await this.hashPassword(user.password)
      ).toString();
      userToUpdate.firstName = user.firstName;
      userToUpdate.lastName = user.lastName;
      userToUpdate.photo = user.photo;
      userToUpdate.phone_number = user.phone_number;
      userToUpdate.role = user.role;
      userToUpdate.updated_id = id;
      await this.em.flush();
      return await this.getDataResponse(
        `Update User with ID ${user.id} success`,
        'OK',
        userToUpdate,
      );
    } catch (error) {
      return await this.getDataResponse(error.message, 'Failed', user);
    }
  }

  async deleteUser(id: number): Promise<{}> {
    try {
      const userToDelete = await this.getUserById(id);

      this.em.remove(userToDelete);
      await this.em.flush();
      return await this.getDataResponse(
        `Delete User with ID ${id} success`,
        'OK',
        [],
      );
    } catch (error) {
      return await this.getDataResponse(error.message, 'Failed', []);
    }
  }
}
