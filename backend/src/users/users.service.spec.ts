import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Token, Mailer } from '../_helper';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockToken = {
    generate: jest.fn(),
  };

  const mockMailer = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,

        // ✅ Correct repository provider
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },

        { provide: JwtService, useValue: mockJwtService },
        { provide: Token, useValue: mockToken },
        { provide: Mailer, useValue: mockMailer },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'jd@gmail.com',
        password: 'password123',
        address: '123 Main St',
        phone_number: '1234567890',
      };

      const savedUser = { id: '1', ...dto };

      mockUserRepository.create.mockReturnValue(dto);
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(dto);

      expect(result).toEqual({
        message: 'User created successfully',
        data: savedUser,
      });

      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: '1', email: 'jd@gmail.com' }];

      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual({
        message: 'Users fetched successfully',
        data: users,
        count: users.length,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: '1', email: 'jd@gmail.com' };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(result).toEqual({
        message: 'User fetched successfully',
        data: user,
      });
    });

    it('should throw 404 if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('99')).rejects.toMatchObject({
        status: 404,
      });
    });
  });

  describe('update', () => {
    it('should update user if exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: '1' });
      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update('1', { first_name: 'Updated' });

      expect(result).toEqual({
        message: 'User updated successfully',
      });
    });

    it('should throw 404 if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('99', { first_name: 'Updated' }),
      ).rejects.toMatchObject({ status: 404 });
    });
  });

  // describe('remove', () => {
  //   it('should delete user if exists', async () => {
  //     mockUserRepository.findOne.mockResolvedValue({ id: '1' });
  //     mockUserRepository.delete.mockResolvedValue({ affected: 1 });

  //     const result = await service.remove('1');

  //     expect(result).toEqual({
  //       message: 'User removed successfully',
  //     });
  //   });

  //   it('should throw 404 if user not found', async () => {
  //     mockUserRepository.findOne.mockResolvedValue(null);

  //     await expect(service.remove('99')).rejects.toMatchObject({
  //       status: 404,
  //     });
  //   });
  // });
});
