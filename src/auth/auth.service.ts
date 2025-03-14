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
import { TokenEntity } from './entities/token.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

interface JwtPayload {
  username: string;
  email: string;
  sub: string;
}

interface DecodedRefreshToken {
  refresh_token: string;
}

export interface AccessToken {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  private async storeRefreshToken(
    user: UserEntity,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<void> {
    const token = this.tokenRepository.create({
      refreshToken,
      user,
      expiresAt,
    });
    await this.tokenRepository.save(token);
  }

  private validateRefreshToken(token: string) {
    let decodedRefreshToken: DecodedRefreshToken;

    try {
      decodedRefreshToken = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Invalid to decode refresh token');
    }

    return decodedRefreshToken.refresh_token;
  }

  async refreshAccessToken(refreshToken: string) {
    const originalRefreshToken = this.validateRefreshToken(refreshToken);

    const token = await this.tokenRepository.findOne({
      where: { refreshToken: originalRefreshToken },
      relations: ['user'],
    });

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const payload: JwtPayload = {
      email: token.user.email,
      username: token.user.username,
      sub: token.user.id,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '20m',
    });

    return { access_token };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
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
      expiresIn: '20m',
    });

    const refresh_token = this.generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await this.storeRefreshToken(user, refresh_token, expiresAt);

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
    const originalRefreshToken = this.validateRefreshToken(refreshToken);
    const token = await this.tokenRepository.findOneOrFail({
      where: { refreshToken: originalRefreshToken },
      relations: ['user'],
    });

    if (token) {
      await this.tokenRepository.remove(token);
    }
    return 'Logged out successfully';
  }
}
