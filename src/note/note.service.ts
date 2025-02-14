import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteRepository } from './note.repository';
import { TagsRepository } from 'src/tags/tags.repository';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteRepository)
    private readonly notesRepository: NoteRepository,
    @InjectRepository(TagsRepository)
    private readonly tagsRepository: TagsRepository,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const newNote = this.notesRepository.create({
      title: createNoteDto.title,
      description: createNoteDto.description,
      userId: createNoteDto.userId,
    });

    if (createNoteDto.tag_name) {
      let tag = await this.tagsRepository.findOneBy({
        name: createNoteDto.tag_name,
      });

      if (!tag) {
        tag = this.tagsRepository.create({ name: createNoteDto.tag_name });
        await this.tagsRepository.save(tag);
      }

      newNote.tag = tag;
    }

    return await this.notesRepository.save(newNote);
  }

  async findAll(userId): Promise<Note[]> {
    return await this.notesRepository.find({
      where: { user: { id: userId } },
      relations: ['tag'],
    });
  }

  async findAllByStatus(userId: string, archived: boolean): Promise<Note[]> {
    const notes = await this.notesRepository.find({
      where: { user: { id: userId }, archived },
      relations: ['user'],
    });
  
    if (!notes || notes.length === 0) {
      return []
    }
  
    return notes;
  }
  async findByFilters(
    userId: string,
    tagName: string,
    archived: boolean,
  ): Promise<Note[]> {
    const query: any = { userId };
  
    if (tagName) {
      const tag = await this.tagsRepository.findOneBy({ name: tagName });
      if (!tag) {
        throw new NotFoundException('Etiqueta no encontrada');
      }
      query.tag = { id: tag.id };
    }
  
    if (archived !== undefined) {
      query.archived = archived;
    }
  
    const notes = await this.notesRepository.find({
      where: query,
      relations: ['tag'],
    });
  
    if (!notes || notes.length === 0) {
      return [];
    }
  
    return notes;
  }

  async findOne(id: number, userId: string): Promise<Note> {
    const note = await this.notesRepository.findOneBy({
      id,
      user: { id: userId },
    });
    if (!note) {
      throw new NotFoundException('Nota no encontrada');
    }
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.notesRepository.findOneBy({ id });
    if (!note) {
      throw new NotFoundException('Nota no encontrada');
    }
  
    if (updateNoteDto.title !== undefined) {
      note.title = updateNoteDto.title;
    }
    if (updateNoteDto.description !== undefined) {
      note.description = updateNoteDto.description;
    }
  
    if (updateNoteDto.tag_name !== undefined) {
      if (updateNoteDto.tag_name) {
        let tag = await this.tagsRepository.findOneBy({
          name: updateNoteDto.tag_name,
        });
  
        if (!tag) {
          tag = this.tagsRepository.create({ name: updateNoteDto.tag_name });
          await this.tagsRepository.save(tag);
        }
  
        note.tag = tag;
      } else {
        note.tag = null; 
      }
    }
  
    return await this.notesRepository.save(note);
  }
  async remove(id: number): Promise<void> {
    const deleteResult = await this.notesRepository.softDelete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException('No se pudo eliminar la nota');
    }
  }

  async setArchivedStatus(id: number, archived: boolean): Promise<void> {
    const note = await this.notesRepository.findOneBy({ id });
    if (!note) {
      throw new NotFoundException('Nota no encontrada');
    }

    await this.notesRepository.setArchivedStatus(id, archived);
  }

  async archived(id: number): Promise<void> {
    await this.setArchivedStatus(id, true);
  }

  async unarchived(id: number): Promise<void> {
    await this.setArchivedStatus(id, false);
  }
}
