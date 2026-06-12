import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import {
  type CreateParticipantDto,
  CreateParticipantSchema,
} from './dto/create-participant.dto';
import {
  type UpdateParticipantDto,
  UpdateParticipantSchema,
} from './dto/update-participant.dto';
import { ZodPipe } from 'src/zod/zod.pipe';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  create(
    @Body(new ZodPipe(CreateParticipantSchema))
    createParticipantDto: CreateParticipantDto,
  ) {
    return this.participantsService.create(createParticipantDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('institusi') institusi: string,
    @Query('jurusan') jurusan: string,
    @Query('semester') semester: number,
    @Query('event_id') eventId: number,
  ) {
    return this.participantsService.findAllByQuery(
      name,
      email,
      institusi,
      jurusan,
      semester,
      eventId,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participantsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(UpdateParticipantSchema))
    updateParticipantDto: UpdateParticipantDto,
  ) {
    return this.participantsService.update(+id, updateParticipantDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participantsService.remove(+id);
  }
}
