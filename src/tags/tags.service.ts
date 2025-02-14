import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsRepository } from './tags.repository';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagsRepository)
    private readonly tagsRepository: TagsRepository,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const createTag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(createTag);
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagsRepository.find();
  }

  async findAllByIds(ids: number[]): Promise<Tag[]> {
    return await this.tagsRepository.findAllByIds(ids);
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagsRepository.findOneBy({ id });
    if (!tag) {
      throw new NotFoundException('Etiqueta no encontrada');
    }
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.tagsRepository.findOneBy({ id });
    if (!tag) {
      throw new NotFoundException('Etiqueta no encontrada');
    }

    const updatedTag = this.tagsRepository.create({
      ...tag,
      ...updateTagDto,
    });

    return await this.tagsRepository.save(updatedTag);
  }

  async remove(id: number): Promise<{ affected?: number }> {
    const deleteResult = await this.tagsRepository.softDelete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException('No se pudo eliminar la etiqueta');
    }
    return deleteResult;
  }
}