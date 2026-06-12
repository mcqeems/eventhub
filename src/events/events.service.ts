import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { events } from '../generated/prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createEventDto: CreateEventDto,
  ): Promise<{ status: number; message: string; data: events }> {
    const event = await this.prismaService.events.create({
      data: {
        name: createEventDto.name,
        date: createEventDto.date,
        location: createEventDto.location,
        min: createEventDto.min,
        max: createEventDto?.max,
      },
    });

    if (!event) {
      throw new InternalServerErrorException();
    }

    return {
      status: 200,
      message: 'Event successfully created.',
      data: event,
    };
  }

  async findAll(): Promise<{
    status: number;
    message: string;
    data: events[];
  }> {
    const event = await this.prismaService.events.findMany();

    if (!event) {
      throw new InternalServerErrorException();
    }

    return {
      status: 200,
      message: 'Events successfully fetched.',
      data: event,
    };
  }

  async findOne(
    id: number,
  ): Promise<{ status: number; message: string; data: events }> {
    const event = await this.prismaService.events.findUnique({
      where: {
        id: id,
      },
    });

    if (!event) {
      throw new NotFoundException(
        `The corresponding event with id ${id} is not found.`,
      );
    }

    return {
      status: 200,
      message: `Event successfully fetched with id ${id}.`,
      data: event,
    };
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
  ): Promise<{ status: number; message: string; data: events }> {
    const event = await this.prismaService.events.update({
      where: {
        id: id,
      },
      data: {
        name: updateEventDto?.name,
        location: updateEventDto?.location,
        date: updateEventDto?.date,
        max: updateEventDto?.max,
        min: updateEventDto?.min,
      },
    });

    if (!event) {
      throw new InternalServerErrorException();
    }

    return {
      status: 200,
      message: `Event successfully updated with id ${id}`,
      data: event,
    };
  }

  async remove(id: number): Promise<{ status: number; message }> {
    const event = await this.prismaService.events.delete({
      where: {
        id: id,
      },
    });

    if (!event) {
      throw new InternalServerErrorException();
    }

    return {
      status: 200,
      message: `Event successfully deleted with id ${id}`,
    };
  }
}
