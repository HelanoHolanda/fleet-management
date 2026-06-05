import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from '../../users/repositories/users.repository';

export interface JwtPayload {
  sub: string;
  nickname: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET') ?? 'secret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersRepository.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
