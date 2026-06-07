import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserUseCase } from './use-cases/create-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersRepository, CreateUserUseCase],
  exports: [UsersRepository, CreateUserUseCase],
})
export class UsersModule {}
