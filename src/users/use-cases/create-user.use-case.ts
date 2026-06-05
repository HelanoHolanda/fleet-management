import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const emailExists = await this.usersRepository.findByEmail(dto.email);
    if (emailExists) {
      throw new ConflictException('Email já cadastrado');
    }

    const nicknameExists = await this.usersRepository.findByNickname(
      dto.nickname,
    );
    if (nicknameExists) {
      throw new ConflictException('Nickname já cadastrado');
    }

    const hashedPassword = await hash(dto.password, 10);

    return this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });
  }
}
