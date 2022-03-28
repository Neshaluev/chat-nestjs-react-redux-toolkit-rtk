import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  getAll() {
    return `auth controller`;
  }

  @Post('/signUp')
  async signUp(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.singUp(userDto);
    // console.log('tokens', tokens);
    if (!tokens) {
      throw new HttpException(
        'User under this username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { user, token: tokens.accessToken };
  }

  @Post('/signIn')
  @UseGuards(LocalAuthGuard)
  async singIn(
    @Body() userDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.signIn(userDto);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { user, token: tokens.accessToken };
  }

  @Post('/update')
  async updateToken(@Req() req: Request) {
    const { refreshToken } = req.cookies;
    const accessToken = await this.authService.updateAccessToken(refreshToken);

    if (!accessToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return accessToken;
  }
}
