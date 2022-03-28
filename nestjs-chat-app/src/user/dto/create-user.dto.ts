export class CreateUserDto {
  readonly username: string;

  readonly password: string;

  readonly avatar: string;

  readonly is_admin: boolean;
}
