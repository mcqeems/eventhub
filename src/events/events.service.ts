import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
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

    return {
      status: 201,
      message: 'Event successfully created.',
      data: event,
    };
  }

  async findAll(): Promise<{
    status: number;
    message: string;
    data: events[];
  }> {
    const event = await this.prismaService.events.findMany({
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

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
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
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

  // async findOneByQuery(
  //   id: number,
  // ): Promise<{ status: number; message: string; data: events }> {
  //   const event = await this.prismaService.events.findUnique({
  //     where: {
  //       id: id,
  //     },
  //     include: {
  //       _count: {
  //         select: {
  //           participants: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!event) {
  //     throw new NotFoundException(
  //       `The corresponding event with id ${id} is not found.`,
  //     );
  //   }

  //   return {
  //     status: 200,
  //     message: `Event successfully fetched with id ${id}.`,
  //     data: event,
  //   };
  // }

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
  ): Promise<{ status: number; message: string; data: events }> {
    try {
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

      return {
        status: 200,
        message: `Event successfully updated with id ${id}`,
        data: event,
      };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Event with id ${id} not found.`);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number): Promise<{ status: number; message: string }> {
    try {
      await this.prismaService.events.delete({
        where: {
          id: id,
        },
      });

      return {
        status: 200,
        message: `Event successfully deleted with id ${id}`,
      };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Event with id ${id} not found.`);
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          `Cannot delete event with id ${id} because it still has participants tied to it.`,
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
