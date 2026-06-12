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
import { EventsService } from './events.service';
import { type CreateEventDto, CreateEventSchema } from './dto/create-event.dto';
import { type UpdateEventDto, UpdateEventSchema } from './dto/update-event.dto';
import { ZodPipe } from 'src/zod/zod.pipe';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body(new ZodPipe(CreateEventSchema)) createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll(
    @Query('name') name: string,
    @Query('date') date: string,
    @Query('location') location: string,
  ) {
    return this.eventsService.findAllByQuery(name, date, location);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(UpdateEventSchema)) updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
