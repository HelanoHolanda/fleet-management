import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersRepository } from '../users/repositories/users.repository';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<Pick<UsersRepository, 'findByNickname'>>;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>;

  const user: User = {
    id: 'user-id',
    nickname: 'aivacol',
    name: 'Aivacol Admin',
    email: 'aivacol@aivacol.com',
    password: 'hashed-password',
    createdAt: new Date('2026-06-05T00:00:00.000Z'),
    updatedAt: new Date('2026-06-05T00:00:00.000Z'),
    createdBy: null,
  };

  beforeEach(() => {
    usersRepository = {
      findByNickname: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };

    service = new AuthService(
      usersRepository as unknown as UsersRepository,
      jwtService as unknown as JwtService,
    );
    jest.mocked(compare).mockReset();
  });

  it('should return an access token when credentials are valid', async () => {
    usersRepository.findByNickname.mockResolvedValue(user);
    jest.mocked(compare).mockResolvedValue(true as never);
    jwtService.sign.mockReturnValue('jwt-token');

    const result = await service.login({
      nickname: 'aivacol',
      password: 'aivacol123',
    });

    expect(usersRepository.findByNickname).toHaveBeenCalledWith('aivacol');
    expect(compare).toHaveBeenCalledWith('aivacol123', 'hashed-password');
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 'user-id',
      nickname: 'aivacol',
    });
    expect(result).toEqual({ access_token: 'jwt-token' });
  });

  it('should throw UnauthorizedException when user is not found', async () => {
    usersRepository.findByNickname.mockResolvedValue(null);

    await expect(
      service.login({ nickname: 'aivacol', password: 'aivacol123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should throw UnauthorizedException when password does not match', async () => {
    usersRepository.findByNickname.mockResolvedValue(user);
    jest.mocked(compare).mockResolvedValue(false as never);

    await expect(
      service.login({ nickname: 'aivacol', password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
