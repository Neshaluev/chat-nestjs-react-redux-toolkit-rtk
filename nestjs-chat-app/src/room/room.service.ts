import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddMessageDto } from 'src/chat/dto/add-message.dto';
import { BanUserDto } from 'src/chat/dto/ban-user.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Message } from './entrities/message.entity';
import { Room } from './entrities/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
  ) {}

  async create(roomDto: CreateRoomDto) {
    const room = await this.roomRepository.create({
      ...roomDto,
    });

    return this.roomRepository.save(room);
  }

  async findOne(id: string) {
    const room = await this.roomRepository.findOne(id);

    if (!room) {
      throw new NotFoundException(`There is no room under id ${id}`);
    }

    return room;
  }

  async findAll() {
    const rooms = await this.roomRepository.find({ relations: ['messages'] });

    return rooms;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomRepository.preload({
      id,
      ...updateRoomDto,
    });

    if (!room) {
      throw new NotFoundException(`There is no room under id ${id}`);
    }

    return this.roomRepository.save(room);
  }

  async remove(id: string) {
    const room = await this.findOne(id);

    return this.roomRepository.remove(room);
  }

  async findOneWithRelations(id: string) {
    const room = await this.roomRepository.findOne(id, {
      relations: ['messages', 'users', 'bannedUsers'],
    });

    if (!room) {
      throw new NotFoundException(`There is no room under id ${id}`);
    }

    return room;
  }

  async addMessage(addMessageDto: AddMessageDto) {
    const { roomId, userId, text } = addMessageDto;

    const room = await this.findOne(roomId);
    const user = await this.userService.findOne(userId);

    const message = await this.messageRepository.create({
      text,
      room,
      user,
    });

    console.log('message', message);

    return this.messageRepository.save(message);
  }

  async findAllMessagesByIdRoom(roomId: string) {
    const result = await this.messageRepository.find({
      relations: ['user', 'room'],
      where: {
        room: { id: roomId },
      },
    });

    let finalResult = result.map((item: any) => {
      return {
        ...item,
        user: {
          id: item.user.id,
          username: item.user.username,
          avatar: item.user.avatar,
          is_admin: item.user.is_admin,
        },
      };
    });

    return finalResult;
  }

  async banUserFromRoom(banUserDto: BanUserDto) {
    const { userId, roomId } = banUserDto;

    const user = await this.userService.findOne(userId);
    const room = await this.findOne(roomId);

    await this.userService.updateUserRoom(userId, null);

    const bannedUsers = { ...room.bannedUsers, ...user };
    const updatedRoom = await this.roomRepository.preload({
      id: roomId,
      bannedUsers,
    });

    return this.roomRepository.save(updatedRoom);
  }
}
