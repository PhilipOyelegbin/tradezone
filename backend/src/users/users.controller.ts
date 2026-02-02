import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  ForbiddenException,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AuthUserDto,
  CreateUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateUserDto,
} from './dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseLogger, JwtGuard } from '../_config';

@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('users')
export class UsersController extends BaseLogger {
  constructor(private readonly usersService: UsersService) {
    super(UsersController.name);
  }

  @ApiOperation({ summary: 'Register User', description: 'Create a new user' })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post('register')
  create(@Body() dto: CreateUserDto) {
    const { first_name, last_name, email, password, address, phone_number } =
      dto;
    if (
      !first_name ||
      !last_name ||
      !email ||
      !password ||
      !address ||
      !phone_number
    ) {
      this.logger.warn('Missing required fields for registration');
      throw new BadRequestException('All fields are required');
    }

    return this.usersService.create(dto);
  }

  @ApiOperation({ summary: 'Verify Email', description: 'Verify user email' })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post('verify-email/:token')
  @HttpCode(HttpStatus.OK)
  verifyUser(@Param('token') token: string) {
    if (!token) {
      this.logger.warn('Missing token for verification');
      throw new BadRequestException('Token is required');
    }

    return this.usersService.verifyUser(token);
  }

  @ApiOperation({
    summary: 'Resend Verification Mail',
    description: 'Resend verification email to user',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Post('resend-verification/:id')
  @HttpCode(HttpStatus.OK)
  resendVerificationEmail(@Param('id') id: string) {
    if (!id) {
      this.logger.warn('Missing user id for resending verification email');
      throw new BadRequestException('User ID is required');
    }

    return this.usersService.resendVerificationEmail(id);
  }

  @ApiOperation({
    summary: 'User Login',
    description: 'Authenticate user and return JWT token',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  authenticate(@Body() dto: AuthUserDto) {
    const { email, password } = dto;
    if (!email || !password) {
      this.logger.warn('Missing email or password for authentication');
      throw new BadRequestException('All fields are required');
    }

    return this.usersService.authenticate(dto);
  }

  @ApiOperation({
    summary: 'Get All Users',
    description: 'Retrieve a list of all users',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get()
  findAll(@Req() req: any) {
    if (!req?.user.is_admin) {
      this.logger.warn('Forbidden access attempt to all users data');
      throw new ForbiddenException('Access to resource denied');
    }
    return this.usersService.findAll();
  }

  @ApiOperation({
    summary: 'Get User by ID',
    description: 'Retrieve a user by their ID',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    if (req.user.id !== id) {
      this.logger.warn(
        `Forbidden access attempt to user data: ${id} by user: ${req.user.id}`,
      );
      throw new ForbiddenException('Access to resource denied');
    }
    if (!id) {
      this.logger.warn('Missing user id for fetching user data');
      throw new BadRequestException('User ID is required');
    }

    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update User', description: 'Update user details' })
  @ApiAcceptedResponse({ description: 'Updated' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    if (req.user.id !== id) {
      this.logger.warn(
        `Forbidden access attempt to update user data: ${id} by user: ${req.user.id}`,
      );
      throw new ForbiddenException('Access to resource denied');
    }
    if (!id) {
      this.logger.warn('Missing user id for updating user data');
      throw new BadRequestException('User ID is required');
    }

    return this.usersService.update(id, dto);
  }

  @ApiOperation({
    summary: 'Delete User',
    description: 'Delete a user details',
  })
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: any, @Param('id') id: string) {
    if (req.user.id !== id) {
      this.logger.warn(
        `Forbidden access attempt to delete user data: ${id} by user: ${req.user.id}`,
      );
      throw new ForbiddenException('Access to resource denied');
    }
    if (!id) {
      this.logger.warn('Missing user id for deleting user data');
      throw new BadRequestException('User ID is required');
    }

    return this.usersService.remove(id);
  }

  @ApiOperation({
    summary: 'Forgot Password',
    description: 'Send password reset token to email',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  forgetPassword(@Body() dto: ForgotPasswordDto) {
    if (!dto.email) {
      this.logger.warn('Missing email for forgot password request');
      throw new BadRequestException('Email is required');
    }
    return this.usersService.forgetPassword(dto.email);
  }

  @ApiOperation({
    summary: 'Reset Password',
    description: 'Reset user password',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    if (!dto.token || !dto.password) {
      this.logger.warn('Missing token or password for resetting password');
      throw new BadRequestException('All fields are required');
    }

    return this.usersService.resetPassword(dto.token, dto.password);
  }
}
