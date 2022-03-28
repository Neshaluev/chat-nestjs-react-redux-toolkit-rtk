import { User } from 'src/user/entities/user.entities';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 60 })
  description: string;

  @Column()
  avatar: string;

  @Column('uuid')
  ownerId: string;

  @OneToMany(() => User, (user: User) => user.room)
  users: Array<User>;

  @OneToMany(() => Message, (message: Message) => message.room)
  messages: Array<Message>;

  @ManyToMany(() => User, (user: User) => user.bannedRooms)
  bannedUsers: Array<User>;
}
