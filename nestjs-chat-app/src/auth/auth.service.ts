import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { User } from 'src/user/entities/user.entities';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async singUp(userDto: CreateUserDto) {
    const candidate = await this.userService.findOneByUsername(
      userDto.username,
    );

    if (candidate) return null;

    const hashedPassword = await bcrypt.hash(userDto.password, 7);
    const { id, is_admin, username, avatar } = await this.userService.create({
      ...userDto,
      password: hashedPassword,
    });

    const user = {
      id,
      username,
      avatar,
      is_admin,
    };

    const tokens = await this.generateTokens(id);

    return { user, tokens };
  }

  async signIn(userDto: LoginUserDto) {
    const { id, avatar, username, is_admin, bannedRooms } =
      await this.userService.findOneByUsername(userDto.username);

    const tokens = await this.generateTokens(id);

    const user = {
      id,
      avatar,
      username,
      is_admin,
      bannedRooms,
    };

    return { user, tokens };
  }

  async validateUser(userDto: LoginUserDto): Promise<User> {
    const user = await this.userService.findOneByUsername(userDto.username);

    if (!user) {
      throw new NotFoundException(`There is no user under this username`);
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (passwordEquals) return user;

    throw new UnauthorizedException({ message: 'Incorrect password' });
  }

  async updateAccessToken(refreshToken: string) {
    try {
      const userId = this.verifyRefreshToken(refreshToken);
      const tokens = await this.generateTokens(userId);
      return tokens.accessToken;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    return payload;
  }

  verifyAccessToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      // console.log('pay load', payload);
      return payload;
    } catch (err) {
      return null;
    }
  }

  private async generateTokens(id: string) {
    const payload = { id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRE,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    });

    const tokens = { accessToken, refreshToken };
    return tokens;
  }
}
