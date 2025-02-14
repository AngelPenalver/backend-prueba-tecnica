import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadGatewayException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto) {
    try {
      const newNote = await this.noteService.create(createNoteDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Nota creada con éxito',
        data: newNote,
      };
    } catch (error) {
      throw new BadGatewayException('Error al crear la nota: ' + error.message);
    }
  }
  @Get('filter')
async findByFilters(
  @Query('userId') userId: string,
  @Query('tagName') tagName: string,
  @Query('archived') archived: boolean,
) {
  try {
    const notes = await this.noteService.findByFilters(userId, tagName, archived);
    return {
      statusCode: HttpStatus.OK,
      message: 'Notas obtenidas con éxito',
      data: notes,
    };
  } catch (error) {
    throw new BadGatewayException(
      'Error al obtener las notas: ' + error.message,
    );
  }
}

  @Get()
  async findAll(@Query('userId') userId: string) {
    try {
      const notes = await this.noteService.findAll(userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Notas obtenidas con éxito',
        data: notes,
      };
    } catch (error) {
      throw new BadGatewayException(
        'Error al obtener las notas: ' + error.message,
      );
    }
  }

  @Get('status')
  async findAllByStatus(
    @Query('userId') userId: string,
    @Query('archived') archived: boolean,
  ) {
    try {
      const notes = await this.noteService.findAllByStatus(userId, archived);
      return {
        statusCode: HttpStatus.OK,
        message: archived ? 'Notas archivadas obtenidas con éxito' : 'Notas no archivadas obtenidas con éxito',
        data: notes,
      };
    } catch (error) {
      throw new NotFoundException(
        'Error al obtener las notas: ' + error.message,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('userId') userId: string) {
    try {
      const note = await this.noteService.findOne(+id, userId);
      if (!note) {
        throw new NotFoundException('Nota no encontrada');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Nota obtenida con éxito',
        data: note,
      };
    } catch (error) {
      throw new BadGatewayException(
        'Error al obtener la nota: ' + error.message,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    try {
      const updatedNote = await this.noteService.update(+id, updateNoteDto);
      if (!updatedNote) {
        throw new NotFoundException('Nota no encontrada');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Nota actualizada con éxito',
        data: updatedNote,
      };
    } catch (error) {
      throw new BadGatewayException(
        'Error al actualizar la nota: ' + error.message,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('userId') userId: string) {
    try {
      const note = await this.noteService.findOne(+id, userId);
      if (!note) {
        throw new NotFoundException('Nota no encontrada');
      }
      await this.noteService.remove(+id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Nota eliminada con éxito',
      };
    } catch (error) {
      throw new BadGatewayException(
        'Error al eliminar la nota: ' + error.message,
      );
    }
  }

  @Patch(':id/archived')
  async archived(@Param('id') id: string) {
    try {
      await this.noteService.archived(+id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Nota archivada con éxito',
      };
    } catch (error) {
      throw new BadGatewayException(
        'Error al archivar la nota: ' + error.message,
      );
    }
  }

  @Patch(':id/unarchived')
  async unarchived(@Param('id') id: string) {
    try {
      await this.noteService.unarchived(+id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Nota desarchivada con éxito',
      };
    } catch (error) {
      throw new BadGatewayException(
        'Error al desarchivar la nota: ' + error.message,
      );
    }
  }
}
