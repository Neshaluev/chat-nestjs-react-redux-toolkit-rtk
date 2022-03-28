export class CreateRoomDto {
  readonly name: string;
  readonly description: string;
  readonly avatar: string;
  ownerId?: string;
}
