import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOrCreate(telegramId: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { telegramId } });
    if (!user) {
      user = this.userRepository.create({ telegramId });
      await this.userRepository.save(user);
    }
    return user;
  }

  async updateSum(telegramId: string, value: number): Promise<User> {
    const user = await this.findOrCreate(telegramId);
    user.sum += value;
    return this.userRepository.save(user);
  }
}
