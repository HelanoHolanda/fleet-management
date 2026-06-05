import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersRepository.findByNickname(dto.nickname);
    if (!user) throw new UnauthorizedException('Credenciais invalidas');

    const passwordMatch = await compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    const payload = { sub: user.id, nickname: user.nickname };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
