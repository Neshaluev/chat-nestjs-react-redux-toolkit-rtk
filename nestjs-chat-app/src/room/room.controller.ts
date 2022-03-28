import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { OwnershipGuard } from './guards/ownership.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    console.log('req.user', req.user.id);
    createRoomDto.ownerId = req.user.id;
    return this.roomService.create(createRoomDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async find() {
    return this.roomService.findAll();
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomService.update(id, updateRoomDto);
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}
