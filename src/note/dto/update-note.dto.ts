import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @IsString({ message: 'La descripcion debe de ser un string' })
  @IsOptional()
  description: string;

  @IsString({ message: 'El titulo debe de ser un string' })
  @IsOptional()
  title: string;

  @IsString({message: "La etiqueta debe de ser un string"})
  @IsOptional()
  tag_name: string;
}
