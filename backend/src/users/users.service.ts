import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUserDto, CreateUserDto, UpdateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { User } from './entities/user.entity';
import { Mailer, Token } from 'src/_helper';
import { BaseLogger } from 'src/_config';

@Injectable()
export class UsersService extends BaseLogger {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private tokenService: Token,
    private mailService: Mailer,
  ) {
    super(UsersService.name);
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      this.logger.warn('Existing email');
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await argon.hash(dto.password);
    const { token, expiration } = this.tokenService.generateBasicToken();
    const newUser = this.userRepo.create({
      ...dto,
      password: hashedPassword,
      verification_token: token,
      verification_token_expires_at: expiration,
    });

    const createUser = this.userRepo.save(newUser);
    const message = `
    <p>Hi ${newUser.first_name},</p>
    <p>Welcome to TradeZone! Please verify your email by using the token: <b>${newUser.verification_token}</b></p>
    <p>This token will expire in 1 hours.</p>
    <p>Thank you for joining us!</p>
    <p>Best regards,<br/>The TradeZone Team</p>
    `;
    const mail = this.mailService.sendMail(
      newUser.email,
      'Welcome to TradeZone - Verify Your Email',
      message,
    );

    await Promise.all([createUser, mail]);
    return { message: 'User created successfully, verification mail sent' };
  }

  async resendVerificationEmail(id: string) {
    const existingUser = await this.userRepo.findOne({
      where: { id },
    });
    if (!existingUser) {
      this.logger.warn('User not found');
      throw new NotFoundException('User not found');
    }

    const { token, expiration } = this.tokenService.generateBasicToken();
    const updateUser = this.userRepo.update(
      { id: existingUser.id },
      {
        verification_token: token,
        verification_token_expires_at: expiration,
      },
    );

    const message = `
    <p>Hi ${existingUser.first_name},</p>
    <p>Please verify your email by using the token: <b>${token}</b></p>
    <p>This token will expire in 1 hours.</p>
    <p>Thank you for joining us!</p>
    <p>Best regards,<br/>The TradeZone Team</p>
    `;
    const mail = this.mailService.sendMail(
      existingUser.email,
      'TradeZone - Resend Verification Email',
      message,
    );

    await Promise.all([updateUser, mail]);
    return {
      message: 'Verification email resent successfully',
    };
  }

  async verifyUser(token: string) {
    const verifyToken = await this.userRepo.findOneBy({
      verification_token: token,
      verification_token_expires_at: MoreThan(new Date()),
    });
    if (!verifyToken) {
      this.logger.warn('Invalid or expired token');
      throw new BadRequestException('Token is invalid or expired!');
    }

    await this.userRepo.update(
      { id: verifyToken.id },
      {
        is_verified: true,
        verification_token: '',
      },
    );
    return { message: 'User verified successfully' };
  }

  async authenticate(dto: AuthUserDto) {
    const { email, password } = dto;
    const existingUser = await this.userRepo.find({
      where: { email },
    });
    if (existingUser.length === 0) {
      this.logger.warn('Invalid email');
      throw new UnauthorizedException('Invalid email or password');
    }

    const verifyPassword = await argon.verify(
      existingUser[0].password,
      password,
    );
    if (!verifyPassword) {
      this.logger.warn('Invalid password');
      throw new UnauthorizedException('Invalid email or password');
    }

    const access_token = this.jwtService.sign({
      sub: existingUser[0].id,
      role: existingUser[0].is_admin ? 'admin' : 'customer',
    });
    return {
      message: 'User authenticated successfully',
      data: { token: access_token },
    };
  }

  async findAll() {
    const existingUsers = await this.userRepo.find({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        address: true,
        phone_number: true,
      },
    });
    if (existingUsers.length === 0) {
      this.logger.warn('No users found');
      throw new NotFoundException('No user found');
    }

    return {
      message: 'Users fetched successfully',
      data: existingUsers,
      count: existingUsers.length,
    };
  }

  async findOne(id: string) {
    const existingUser = await this.userRepo.findOne({
      where: { id },
    });
    if (!existingUser) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException('User not found');
    }

    return { message: 'User fetched successfully', data: existingUser };
  }

  async update(id: string, dto: UpdateUserDto) {
    const existingUser = await this.userRepo.findOneBy({ id });
    if (!existingUser) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException('User not found');
    }

    if (dto.password) {
      dto.password = await argon.hash(dto.password);
    }

    await this.userRepo.update({ id }, { ...dto });
    return { message: 'User updated successfully' };
  }

  async remove(id: string) {
    const existingUser = await this.userRepo.findOneBy({ id });
    if (!existingUser) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException('User not found');
    }

    await this.userRepo.remove(existingUser);
    return { message: 'User removed successfully' };
  }

  async forgetPassword(email: string) {
    const existingUser = await this.userRepo.findOne({
      where: { email },
    });
    if (!existingUser) {
      this.logger.warn('User not found');
      throw new NotFoundException('User not found');
    }

    const { token, expiration } = this.tokenService.generateBasicToken();
    const updateUser = this.userRepo.update(
      { id: existingUser.id },
      { reset_token: token, reset_token_expires_at: expiration },
    );

    const message = `
    <p>Hi ${existingUser.first_name},</p>
    <p>We received a request to reset your password. Please use the following token to reset your password: <b>${token}</b></p>
    <p>This token will expire in 1 hours.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Best regards,<br/>The TradeZone Team</p>
    `;
    const mail = this.mailService.sendMail(
      existingUser.email,
      'TradeZone - Password Reset Request',
      message,
    );

    await Promise.all([updateUser, mail]);
    return {
      message: 'Password reset token sent successfully',
    };
  }

  async resetPassword(token: string, password: string) {
    const verifyToken = await this.userRepo.findOneBy({
      reset_token: token,
      reset_token_expires_at: MoreThan(new Date()),
    });
    if (!verifyToken) {
      this.logger.warn('Invalid or expired token');
      throw new BadRequestException('Token is invalid or expired!');
    }

    const hashedPassword = await argon.hash(password);
    await this.userRepo.update(
      { id: verifyToken.id },
      { password: hashedPassword, reset_token: '' },
    );
    return { message: 'Password has been reset successfully' };
  }
}
