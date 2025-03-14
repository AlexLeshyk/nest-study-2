import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserSignInDto } from './dto/user-sign-in.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response } from 'express';

interface IUserRequest {
  user: {
    username: string;
    email: string;
  };
}

@ApiTags('Authentication')
@ApiUnauthorizedResponse({ description: 'Unauthorized response' })
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: IUserRequest) {
    const { username, email } = req.user;

    if (!username || !email) {
      console.log('Google OAuth callback did not return username or email');
      return;
    }

    return { message: 'Google authentication successful' };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiCreatedResponse({
    description: 'The user has been successfully logged in.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiBody({ type: UserSignInDto })
  async login(
    @Body() { email, password }: UserSignInDto,
    @Res() res: Response,
  ) {
    const userData = await this.authService.signIn(email, password);
    res.cookie('refresh_token', userData.refresh_token, {
      httpOnly: true,
      maxAge: 3600 * 30 * 24 * 1000,
    });
    return res.json(userData);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  @ApiCreatedResponse({
    description: 'The user has been successfully registered & created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  signUp(
    @Body()
    { username, email, password, firstName, lastName }: CreateUserDto,
  ) {
    return this.authService.signUp(
      username,
      email,
      password,
      firstName,
      lastName,
    );
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User log out' })
  @ApiCreatedResponse({
    description: 'The user has been logged out.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async logout(
    @Body() { refresh_token }: RefreshTokenDto,
    @Res() res: Response,
  ) {
    const refreshToken = await this.authService.signOut(refresh_token);
    res.clearCookie('refresh_token');
    return res.json(refreshToken);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'refresh access_token' })
  @ApiCreatedResponse({
    description: 'The access token has been successfully refreshed.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async refreshAccessToken(@Body() { refresh_token }: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refresh_token);
  }
}
