import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { participants } from '../generated/prisma/client';

@Injectable()
export class ParticipantsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createParticipantDto: CreateParticipantDto,
  ): Promise<{ status: number; message: string; data: participants }> {
    try {
      const participant = await this.prismaService.participants.create({
        data: {
          name: createParticipantDto.name,
          email: createParticipantDto.email,
          institusi: createParticipantDto.institusi,
          jurusan: createParticipantDto.jurusan,
          semester: createParticipantDto.semester,
          event_id: createParticipantDto.event_id,
        },
      });

      return {
        status: 201,
        message: 'Participant successfully created.',
        data: participant,
      };
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new NotFoundException(
          `Event with id ${createParticipantDto.event_id} does not exist.`,
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  // async findAll(): Promise<{
  //   status: number;
  //   message: string;
  //   data: participants[];
  // }> {
  //   const participantList = await this.prismaService.participants.findMany({
  //     include: {
  //       events: true,
  //     },
  //   });

  //   return {
  //     status: 200,
  //     message: 'Participants successfully fetched.',
  //     data: participantList,
  //   };
  // }

  async findAllByQuery(
    name?: string,
    email?: string,
    institusi?: string,
    jurusan?: string,
    semester?: number,
    eventId?: number,
  ): Promise<{
    status: number;
    message: string;
    data: participants[];
  }> {
    const participantList = await this.prismaService.participants.findMany({
      where: {
        name: name ? { contains: name } : undefined,
        email: email ? { contains: email } : undefined,
        institusi: institusi ? { contains: institusi } : undefined,
        jurusan: jurusan ? { contains: jurusan } : undefined,
        semester: semester ? { equals: Number(semester) } : undefined,
        event_id: eventId ? { equals: Number(eventId) } : undefined,
      },
      include: {
        events: true,
      },
    });

    if (!participantList) {
      throw new NotFoundException(
        `The corresponding participants with that query is not found.`,
      );
    }

    return {
      status: 200,
      message: 'Participants successfully fetched.',
      data: participantList,
    };
  }

  async findOne(
    id: number,
  ): Promise<{ status: number; message: string; data: participants }> {
    const participant = await this.prismaService.participants.findUnique({
      where: {
        id: id,
      },
      include: {
        events: true,
      },
    });

    if (!participant) {
      throw new NotFoundException(
        `The corresponding participant with id ${id} is not found.`,
      );
    }

    return {
      status: 200,
      message: `Participant successfully fetched with id ${id}.`,
      data: participant,
    };
  }

  async update(
    id: number,
    updateParticipantDto: UpdateParticipantDto,
  ): Promise<{ status: number; message: string; data: participants }> {
    try {
      const participant = await this.prismaService.participants.update({
        where: {
          id: id,
        },
        data: {
          name: updateParticipantDto?.name,
          email: updateParticipantDto?.email,
          institusi: updateParticipantDto?.institusi,
          jurusan: updateParticipantDto?.jurusan,
          semester: updateParticipantDto?.semester,
          event_id: updateParticipantDto?.event_id,
        },
      });

      return {
        status: 200,
        message: `Participant successfully updated with id ${id}`,
        data: participant,
      };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Participant with id ${id} not found.`);
      }
      if (error.code === 'P2003') {
        throw new NotFoundException(
          `Event with id ${updateParticipantDto.event_id} does not exist.`,
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number): Promise<{ status: number; message: string }> {
    try {
      await this.prismaService.participants.delete({
        where: {
          id: id,
        },
      });

      return {
        status: 200,
        message: `Participant successfully deleted with id ${id}`,
      };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Participant with id ${id} not found.`);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
