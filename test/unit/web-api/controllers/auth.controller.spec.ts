import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../../src/web-api/controllers/auth/auth.controller';
import {
  IAuthService,
  AUTH_SERVICE,
} from '../../../../src/domain/services/auth.service.interface';

const createMockAuthService = (): IAuthService => ({
  login: jest.fn(),
  validateToken: jest.fn(),
});

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: ReturnType<typeof createMockAuthService>;

  beforeEach(async () => {
    mockAuthService = createMockAuthService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token on successful login', async () => {
      const mockResponse = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      };

      const loginSpy = jest
        .spyOn(mockAuthService, 'login')
        .mockResolvedValue(mockResponse);

      const result = await controller.login();

      expect(loginSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      expect(result.access_token).toBeDefined();
    });

    it('should throw error when login fails', async () => {
      jest
        .spyOn(mockAuthService, 'login')
        .mockRejectedValue(new Error('Authentication failed'));

      await expect(controller.login()).rejects.toThrow('Authentication failed');
    });
  });

  describe('getProfile', () => {
    it('should return protected route message', () => {
      const result = controller.getProfile();

      expect(result).toEqual({ message: 'This is a protected route!' });
      expect(result.message).toBeDefined();
    });
  });
});
