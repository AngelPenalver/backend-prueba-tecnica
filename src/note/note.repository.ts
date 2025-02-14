import { DataSource, Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NoteRepository extends Repository<Note> {
  constructor(private dataSource: DataSource) {
    super(Note, dataSource.createEntityManager());
  }

  async findByDescription(
    description: string,
    userId: string,
  ): Promise<Note[]> {
    return await this.find({ where: { description, user: { id: userId } } });
  }

  async setArchivedStatus(id: number, archived: boolean): Promise<void> {
    await this.update(id, { archived });
  }


}
