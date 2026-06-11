import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { users } from 'src/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(username: string): Promise<users | undefined> {
    const data = await this.prisma.users.findUnique({
      where: {
        username: username,
      },
    });
    return data ?? undefined;
  }

  async findOneById(id: number): Promise<users | undefined> {
    const data = await this.prisma.users.findUnique({
      where: {
        id: id,
      },
    });
    return data ?? undefined;
  }

  async createOne(
    username: string,
    password: string,
  ): Promise<users | undefined> {
    const data = await this.prisma.users.create({
      data: {
        username: username,
        password: password,
      },
    });

    return data ?? undefined;
  }
}
