import 'dotenv/config';
import { hash } from 'bcrypt';
import AppDataSource from '../data-source';
import { User } from '../../users/entities/user.entity';

async function seedAivacolUser(): Promise<void> {
  const dataSource = await AppDataSource.initialize();
  const usersRepository = dataSource.getRepository(User);

  const nickname = process.env.SEED_USER_NICKNAME ?? 'aivacol';
  const existingUser = await usersRepository.findOne({ where: { nickname } });

  if (existingUser) {
    console.log(`Seed user "${nickname}" already exists.`);
    await dataSource.destroy();
    return;
  }

  const user = usersRepository.create({
    nickname,
    name: process.env.SEED_USER_NAME ?? 'Aivacol Admin',
    email: process.env.SEED_USER_EMAIL ?? 'aivacol@aivacol.com',
    password: await hash(process.env.SEED_USER_PASSWORD ?? 'aivacol123', 10),
    createdBy: null,
  });

  await usersRepository.save(user);
  console.log(`Seed user "${nickname}" created.`);

  await dataSource.destroy();
}

void seedAivacolUser().catch((error) => {
  console.error(error);
  process.exit(1);
});
