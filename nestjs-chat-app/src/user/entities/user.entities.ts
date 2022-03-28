import { Message } from 'src/room/entrities/message.entity';
import { Room } from 'src/room/entrities/room.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  username: string;

  @Column({ length: 60 })
  password: string;

  @Column()
  avatar: string;

  @Column()
  is_admin: boolean;

  @JoinTable()
  @ManyToOne(() => Room, (room: Room) => room.users)
  room: Room;

  @OneToMany(() => Message, (message: Message) => message.user)
  messages: Array<Message>;

  @JoinTable()
  @ManyToMany(() => Room, (room: Room) => room.bannedUsers, { eager: true })
  bannedRooms: Array<Room>;
}
