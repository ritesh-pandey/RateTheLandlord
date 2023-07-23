import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IGetUsers, IUser } from './models/user';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUsers: IGetUsers = {
    id: 1,
    name: 'John Smith',
    email: 'john@smith.com',
    blocked: false,
    role: 'USER',
    login_attempts: 2,
    login_lockout: false,
    last_login_attempt: '123',
    lockout_time: '12345',
  };

  const mockUser: IUser = {
    id: 2,
    name: 'Peter Smith',
    email: 'peter@smith.com',
    password: 'password',
    blocked: false,
    role: 'USER',
    login_attempts: 3,
    login_lockout: false,
    last_login_attempt: '123',
    lockout_time: '12345',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getAll: jest.fn().mockReturnValue([mockUsers]),
            create: jest.fn().mockReturnValue(mockUser),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getUsers', () => {
    it('should call userService.getUsers and get all users', async () => {
      const result = await userController.getUsers();

      expect(userService.getAll).toBeCalled();
      expect(result).toStrictEqual([mockUsers]);
    });
  });

  describe('createUser', () => {
    const mockReq = {
      body: mockUser,
    };

    it('should call userService.create with correct params and return created user', async () => {
      const result = await userController.create(mockReq);

      expect(userService.create).toBeCalledWith(mockUser);
      expect(result).toBe(mockUser);
    });
  });
});
