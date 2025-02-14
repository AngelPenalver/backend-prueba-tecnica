import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteRepository } from './note.repository';
import { Note } from './entities/note.entity';
import { TagsModule } from 'src/tags/tags.module';
import { TagsService } from 'src/tags/tags.service';
import { TagsRepository } from 'src/tags/tags.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Note, NoteRepository]), TagsModule],
  controllers: [NoteController],
  providers: [NoteService, NoteRepository, TagsService, TagsRepository],
})
export class NoteModule {}
