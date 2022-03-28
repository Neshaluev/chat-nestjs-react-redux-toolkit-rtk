export interface ILoginForm {
  username: string;
  password: string;
}

export interface IRegsiterForm {
  username: string;
  password: string;
}

export interface IUser {
  id: string;
  username: string | null;
  avatar: string;
  is_admin: boolean;
  bannedRooms?: any[];
}

interface IMessage {
  created_at: string;
  id: string;
  text: string;
}
