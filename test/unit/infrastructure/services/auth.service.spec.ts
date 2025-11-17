import { AuthService } from '../../../../src/infrastructure/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { createMockLogger } from '../../../mocks/logger.mock';
import { DomainError } from '../../../../src/domain/exceptions/domain.error';
import { DomainErrorBR } from '../../../../src/domain/enums/domain.error.enum';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let logger: ReturnType<typeof createMockLogger>;

  beforeEach(() => {
    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as any;
    logger = createMockLogger();
    service = new AuthService(jwtService, logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const spySign = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValue('token123');
      const result = await service.login();
      expect(spySign).toHaveBeenCalledWith({
        sub: 'admin',
        username: 'admin',
        role: 'admin',
      });
      expect(result).toEqual({ access_token: 'token123' });
    });
  });

  describe('validateToken', () => {
    it('should return payload if token is valid', async () => {
      const payload = { sub: 'admin', username: 'admin', role: 'admin' };

      const spyVerify = jest
        .spyOn(jwtService, 'verify')
        .mockReturnValue(payload);

      const result = await service.validateToken('token123');
      expect(spyVerify).toHaveBeenCalledWith('token123');
      expect(result).toEqual(payload);
    });
  });
});
