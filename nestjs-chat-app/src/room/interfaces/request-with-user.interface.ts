import { Request } from 'express';
import { User } from 'src/user/entities/user.entities';

export interface RequestWithUser extends Request {
  user: User;
}
