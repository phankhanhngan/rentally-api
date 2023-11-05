import { EntityManager } from '@mikro-orm/mysql';
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import {
  RatingStatus,
  RentalStatus,
  Role,
  RoomStatus,
  UserStatus,
} from '../../common/enum/common.enum';
import { User } from '../../entities/user.entity';
import { Utility } from '../../entities/utility.entity';
import { utilities } from '../../database/seeders/jsData/utilities';
import { Point, RoomBlock } from '../../entities/room-block.entity';
import { v4 as uuidv4 } from 'uuid';
import { Room } from '../..//entities/room.entity';
import { RentalDetail } from '../../entities/rental_detail.entity';
import { Rental } from '../../entities/rental.entity';
import { RoomRating } from '../../entities/room-rating.entity';
export class DatabaseSeeder extends Seeder {
  leaseTerm = [3, 6, 9, 12];
  async run(em: EntityManager): Promise<void> {
    // users
    const users = [];
    const password = await bcrypt.hash('123456', 10);
    this.createDefaultUser(users, password);
    Array.from(Array(40).keys()).forEach(async () => {
      users.push({
        // id: faker.number.int({ min: 0, max: 100 }),
        googleId: faker.string.uuid(),
        email: faker.internet.email(),
        password: password,
        firstName: faker.animal.bear(),
        lastName: faker.animal.bear(),
        photo: faker.image.avatar(),
        phoneNumber: faker.phone.number(),
        role: this.randomEnumValue(Role),
        verificationCode: faker.string.uuid(),
        timeStamp: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        created_id: faker.number.int({ min: 0, max: 10 }),
        updated_id: faker.number.int({ min: 0, max: 10 }),
        status: UserStatus.ACTIVE,
      });
    });
    await em.insertMany(User, users);
    //---------------------------------------------------------
    // Utility ------------------------------------------------
    await em.insertMany(Utility, utilities);
    //---------------------------------------------------------
    // RoomBlock ----------------------------------------------
    const roomBlocks = await Promise.all(
      Array.from(Array(30).keys()).map(async () => {
        const landlord = await this.randomLandLord(em);
        return {
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          coordinate: new Point(
            faker.location.latitude(),
            faker.location.longitude(),
          ),
          description: faker.lorem.sentence(),
          landlord: landlord,
          created_at: new Date(),
          updated_at: new Date(),
          created_id: landlord.id,
          updated_id: landlord.id,
        };
      }),
    );
    await em.persistAndFlush(
      roomBlocks.map((roomBlockData) => em.create(RoomBlock, roomBlockData)),
    );
    //---------------------------------------------------------
    // Room ----------------------------------------------
    const roomBlocks1 = await em.find<RoomBlock>(RoomBlock, {});
    const rooms = [];
    Array.from(Array(50).keys()).forEach(async () => {
      rooms.push({
        id: uuidv4(),
        created_at: new Date(),
        updated_at: new Date(),
        created_id: faker.number.int({ min: 0, max: 10 }),
        updated_id: faker.number.int({ min: 0, max: 10 }),
        roomName: faker.animal.bear(),
        area: faker.number.int({ min: 0, max: 100 }),
        price: faker.number.int({ min: 0, max: 100 }),
        depositAmount: faker.number.int({ min: 0, max: 100 }),
        images: JSON.stringify([faker.lorem.sentence()]),
        utilities: JSON.stringify([1]),
        status: RoomStatus.EMPTY,
        roomblock: roomBlocks1[Math.floor(Math.random() * roomBlocks1.length)],
      });
    });
    await em.insertMany(Room, rooms);
    //---------------------------------------------------------
    // Rental ----------------------------------------------
    const rentals = [];
    for (let i = 0; i < 10; i++) {
      const rentalDetail = await em.insert(
        RentalDetail,
        this.createRentalDetail(),
      );
      const landlord = await this.randomLandLord(em);
      const renter = await this.randomRenter(em);
      const room = await this.randomRoom(em);
      rentals.push({
        landlord: landlord,
        renter: renter,
        room: room,
        rentalDetail: rentalDetail,
        tenants: 1,
        status: RentalStatus.COMPLETED,
        ratingStatus: RatingStatus.NONE,
        created_at: new Date(),
        updated_at: new Date(),
        created_id: 1,
        updated_id: 1,
      });
    }
    await em.insertMany(Rental, rentals);
    //---------------------------------------------------------
    // Rating ----------------------------------------------
    const rating = [];
    const rentals4 = await em.find(
      Rental,
      { status: RentalStatus.COMPLETED },
      { limit: 5, populate: ['renter', 'landlord', 'room'] },
    );
    for (let i = 0; i < 5; i++) {
      const room = await em.findOne(Room, { id: rentals4[i].room.id });
      const renter = await em.findOne(User, { id: rentals4[i].renter.id });
      rating.push({
        room: room,
        renter: renter,
        rental: rentals4[i],
        comment: faker.lorem.paragraph(),
        cleanRate: Math.floor(Math.random() * 5) + 1,
        supportRate: Math.floor(Math.random() * 5) + 1,
        locationRate: Math.floor(Math.random() * 5) + 1,
        securityRate: Math.floor(Math.random() * 5) + 1,
        created_at: new Date(),
        updated_at: new Date(),
        created_id: 1,
        updated_id: 1,
      });
    }
    await em.insertMany(RoomRating, rating);
  }
  randomEnumValue = (enumeration) => {
    const values = Object.keys(enumeration);
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return enumeration[enumKey];
  };
  async randomLandLord(em: EntityManager) {
    const users = await em.find(User, { role: Role.MOD });
    return users[Math.floor(Math.random() * users.length)];
  }
  async randomRenter(em: EntityManager) {
    const users = await em.find(User, { role: Role.USER });
    return users[Math.floor(Math.random() * users.length)];
  }
  async randomRoom(em: EntityManager) {
    const rooms = await em.find(Room, { status: RoomStatus.EMPTY });
    return rooms[Math.floor(Math.random() * rooms.length)];
  }

  randomArr(arr: any) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  createRentalDetail() {
    return {
      moveInDate: new Date(),
      moveOutDate: new Date('2023-12-30'),
      leaseTerm: this.randomArr(this.leaseTerm),
      monthlyRent: 2000000,
      leaseTerminationCost: 500000,
      renterIdentifyNo: `192${Math.floor(
        100 + Math.random() * 900,
      )}${Math.floor(100 + Math.random() * 900)}`,
      landlordIdentifyNo: `192${Math.floor(
        100 + Math.random() * 900,
      )}${Math.floor(100 + Math.random() * 900)}`,
      renterIdentifyDate: faker.date.birthdate(),
      landlordIdentifyDate: faker.date.birthdate(),
      renterIdentifyAddress: faker.address.streetAddress(),
      landlordIdentifyAddress: faker.address.streetAddress(),
      renterBirthday: faker.date.birthdate(),
      landlordBirthday: faker.date.birthdate(),
      electricPrice: 3500,
      waterPrice: 6000,
      addtionalPrice: 0,
      created_at: new Date(),
      updated_at: new Date(),
      created_id: 1,
      updated_id: 1,
    };
  }
  createDefaultUser(users: any, password: any) {
    users.push(
      {
        googleId: faker.string.uuid(),
        email: 'admin@gmail.com',
        password: password,
        firstName: 'Admin',
        lastName: 'Rentally',
        photo: faker.image.avatar(),
        phoneNumber: faker.phone.number(),
        role: Role.ADMIN,
        verificationCode: faker.string.uuid(),
        timeStamp: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        created_id: faker.number.int({ min: 0, max: 10 }),
        updated_id: faker.number.int({ min: 0, max: 10 }),
        status: UserStatus.ACTIVE,
      },
      {
        googleId: faker.string.uuid(),
        email: 'renter@gmail.com',
        password: password,
        firstName: 'Renter',
        lastName: 'Rentally',
        photo: faker.image.avatar(),
        phoneNumber: faker.phone.number(),
        role: Role.USER,
        verificationCode: faker.string.uuid(),
        timeStamp: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        created_id: faker.number.int({ min: 0, max: 10 }),
        updated_id: faker.number.int({ min: 0, max: 10 }),
        status: UserStatus.ACTIVE,
      },
      {
        // id: faker.number.int({ min: 0, max: 100 }),
        googleId: faker.string.uuid(),
        email: 'mod@gmail.com',
        password: password,
        firstName: 'Mod',
        lastName: 'Rentally',
        photo: faker.image.avatar(),
        phoneNumber: faker.phone.number(),
        role: Role.MOD,
        verificationCode: faker.string.uuid(),
        timeStamp: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        created_id: faker.number.int({ min: 0, max: 10 }),
        updated_id: faker.number.int({ min: 0, max: 10 }),
        status: UserStatus.ACTIVE,
      },
    );
  }
}
