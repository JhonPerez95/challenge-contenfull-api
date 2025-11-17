export interface IAuthService {
  login(): Promise<{ access_token: string }>;
  validateToken(token: string): Promise<any>;
}

export const AUTH_SERVICE = Symbol('IAuthService');
