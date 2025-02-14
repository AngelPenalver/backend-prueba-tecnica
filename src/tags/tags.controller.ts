import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    try {
      const createdTag = await this.tagsService.create(createTagDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Etiqueta creada con éxito',
        data: createdTag,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error al crear la etiqueta: ${error.message}`,
      );
    }
  }

  @Get('byIds')
  async findAllByIds(@Query('ids') ids: string) {
    if (!ids) {
      throw new BadRequestException('Debe ingresar IDs');
    }

    const idsArray = ids
      .split(',')
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));

    if (idsArray.length === 0) {
      throw new BadRequestException('No se proporcionaron IDs válidos');
    }

    try {
      const tags = await this.tagsService.findAllByIds(idsArray);
      return {
        statusCode: HttpStatus.OK,
        message: 'Etiquetas obtenidas con éxito',
        data: tags,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error al obtener las etiquetas: ${error.message}`,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const tags = await this.tagsService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Etiquetas obtenidas con éxito',
        data: tags,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error al obtener las etiquetas: ${error.message}`,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const tag = await this.tagsService.findOne(+id);
      if (!tag) {
        throw new NotFoundException('Etiqueta no encontrada');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Etiqueta obtenida con éxito',
        data: tag,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error al obtener la etiqueta: ${error.message}`,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    try {
      const updatedTag = await this.tagsService.update(+id, updateTagDto);
      if (!updatedTag) {
        throw new NotFoundException('Etiqueta no encontrada');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Etiqueta actualizada con éxito',
        data: updatedTag,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error al actualizar la etiqueta: ${error.message}`,
      );
    }
  }
  
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deleteResult = await this.tagsService.remove(+id);
      if (!deleteResult.affected) {
        throw new NotFoundException('Etiqueta no encontrada');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Etiqueta eliminada con éxito',
      };
    } catch (error) {
      throw new BadRequestException(
        `Error al eliminar la etiqueta: ${error.message}`,
      );
    }
  }
}