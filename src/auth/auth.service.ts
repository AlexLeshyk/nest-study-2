import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { TokenService } from 'src/tokens/token.service';

interface JwtPayload {
  username: string;
  email: string;
  sub: string;
}

export interface AccessToken {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  async refreshAccessToken(refreshToken: string) {
    const originalRefreshToken =
      this.tokenService.validateRefreshToken(refreshToken);

    const token = await this.tokenService.findToken(originalRefreshToken);

    if (token.expiresAt < new Date()) {
      throw new UnauthorizedException('Expired refresh token');
    }

    const payload: JwtPayload = {
      email: token.user.email,
      username: token.user.username,
      sub: token.user.id,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    return { access_token };
  }

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Login or password invalid');
    }

    const payload: JwtPayload = {
      email: user.email,
      username: user.username,
      sub: user.id,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refresh_token = this.tokenService.generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await this.tokenService.storeRefreshToken(user, refresh_token, expiresAt);

    const refresh_token_signed = this.jwtService.sign(
      { refresh_token },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      },
    );

    return { access_token, refresh_token: refresh_token_signed };
  }

  async signUp(
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    const newUser = await this.userRepository.findOne({ where: { email } });

    if (newUser) {
      throw new Error(`User with such ${email} alredy exists`);
    }

    const hashPassword = await bcrypt.hash(password, 4);

    const user = this.userRepository.create({
      username,
      email,
      password: hashPassword,
      firstName,
      lastName,
    });
    return this.userRepository.save(user);
  }

  async signOut(refreshToken: string) {
    const originalRefreshToken =
      this.tokenService.validateRefreshToken(refreshToken);
    await this.tokenService.deleteToken(originalRefreshToken);
    return 'Logged out successfully';
  }
}
