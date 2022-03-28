import { ForbiddenException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';

import { AuthService } from 'src/auth/auth.service';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { formatMessage } from 'src/utils';
import { AddMessageDto } from './dto/add-message.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { KickUserDto } from './dto/kick-user.dto';
import { LeaveRoomDto } from './dto/leave-room.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server;

  connectedUsers: Map<string, string> = new Map();

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly roomService: RoomService,
  ) {}

  async handleConnection(client: any, ...args: any[]) {
    console.log('connect user room');

    const token = client.handshake.query.token.toString();
    const payload = this.authService.verifyAccessToken(token);

    const user = payload && (await this.userService.findOne(payload.id));
    const room = user?.room;

    if (!user) {
      client.disconnect(true);

      return;
    }

    this.connectedUsers.set(client.id, user.id);

    if (room) {
      return this.onRoomJoin(client, { roomId: room.id });
    }
  }

  async handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('join')
  async onRoomJoin(client: Socket, joinRoomDto: JoinRoomDto) {
    const { roomId } = joinRoomDto;

    const room = await this.roomService.findOneWithRelations(roomId);

    if (!room) return;

    const userId = this.connectedUsers.get(client.id);
    const currRoomMessages = await this.roomService.findAllMessagesByIdRoom(
      roomId,
    );

    // fix. update user room
    let updatechat = await this.userService.updateUserRoom(userId, room);

    client.join(roomId);

    client.emit('message', currRoomMessages);
    client.emit('join', [...updatechat.room.users]);
  }

  @SubscribeMessage('message')
  async onMessage(client: Socket, addMessageDto: AddMessageDto) {
    console.log('message', addMessageDto);
    const userId = this.connectedUsers.get(client.id);
    const currUser = await this.userService.findOne(userId);

    if (!currUser.room) {
      return;
    }

    addMessageDto.userId = userId;
    addMessageDto.roomId = currUser.room.id;

    let message = await this.roomService.addMessage(addMessageDto);

    client.to(currUser.room.id).emit('message', formatMessage(message));
  }
  @SubscribeMessage('leave')
  async onRoomLeave(client: Socket, leaveRoomDto: LeaveRoomDto) {
    const { roomId } = leaveRoomDto;

    const userId = this.connectedUsers.get(client.id);

    await this.userService.updateUserRoom(userId, null);
    console.log('leave room');
    client.leave(roomId);
  }
  @SubscribeMessage('user-kick')
  async onUserKick(client: Socket, kickUserDto: KickUserDto) {
    const { roomId, reason } = kickUserDto;

    const userId = this.connectedUsers.get(client.id);
    const room = await this.roomService.findOneWithRelations(roomId);

    if (userId !== room.ownerId) {
      throw new ForbiddenException(`You are not the owner of the room!`);
    }

    await this.userService.updateUserRoom(kickUserDto.userId, null);

    const kickedClient = this.getClientByUserId(kickUserDto.userId);

    if (!kickedClient) return;

    client.to(kickedClient.id).emit('kicked', reason);
    kickedClient.leave(roomId);
  }

  private getClientByUserId(userId: string): Socket | null {
    for (const [key, value] of this.connectedUsers.entries()) {
      if (value === userId) {
        const kickedClient = this.server.sockets.sockets.get(key);

        return kickedClient;
      }
    }

    return null;
  }
  @SubscribeMessage('user-ban')
  async onUserBan(client: Socket, banUserDto: BanUserDto) {
    const { roomId, reason } = banUserDto;

    const userId = this.connectedUsers.get(client.id);
    const room = await this.roomService.findOneWithRelations(roomId);

    if (userId !== room.ownerId) {
      throw new ForbiddenException(`You are not the owner of the room!`);
    }

    if (userId === banUserDto.userId) {
      throw new ForbiddenException(`You can't ban yourself`);
    }

    await this.roomService.banUserFromRoom(banUserDto);

    const bannedClient = this.getClientByUserId(banUserDto.userId);

    if (!bannedClient) return;

    client.to(bannedClient.id).emit('banned', reason);
    bannedClient.leave(roomId);
  }
}
