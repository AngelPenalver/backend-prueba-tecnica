import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { TagsRepository } from './tags.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, TagsRepository])],
  controllers: [TagsController],
  providers: [TagsService, TagsRepository],
  exports: [TagsService]
})
export class TagsModule {}
