import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/room/entrities/room.entity';

import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entities';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository.find();

    return users;
  }

  async create(dto: CreateUserDto) {
    const user = await this.userRepository.create({
      ...dto,
    });

    return this.userRepository.save(user);
  }
  async findOne(id: string) {
    const user = await this.userRepository.findOne(id, {
      relations: ['room'],
    });

    if (!user) {
      throw new NotFoundException(`There is no user under id ${id}`);
    }

    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOne({ username });

    return user;
  }

  async updateUserRoom(id: string, room: Room) {
    const user = await this.userRepository.preload({
      id,
      room,
    });

    if (!user) {
      throw new NotFoundException(`There is no user under id ${id}`);
    }

    const isBanned = user.bannedRooms?.find(
      (bannedRoom) => bannedRoom.id === room?.id,
    );

    if (isBanned) {
      throw new ForbiddenException(`You have been banned from this room`);
    }

    return this.userRepository.save(user);
  }
}
