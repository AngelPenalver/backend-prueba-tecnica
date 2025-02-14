import { DataSource, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsRepository extends Repository<Tag> {
  constructor(private dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }

  async findAllByIds(ids: number[]): Promise<Tag[]> {
    return await this.findBy({
      id: In(ids),
    });
  }
}