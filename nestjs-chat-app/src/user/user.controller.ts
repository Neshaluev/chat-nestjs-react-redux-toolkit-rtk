import { Get, Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getAll() {
    let data = [
      { id: '1', text: 'test 1' },
      { id: '2', text: 'test 2' },
      { id: '3', text: 'test 3' },
      { id: '4', text: 'test 4' },
      { id: '5', text: 'test 5' },
    ];

    return data;
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    console.log('post data', dto);
    return this.userService.create(dto);
  }
}
