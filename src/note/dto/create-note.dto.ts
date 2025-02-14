import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNoteDto {
  @IsString({ message: 'La descripcion debe de ser un string' })
  @IsNotEmpty({ message: 'La descripcion no puede estar vacia' })
  description: string;

  @IsString({ message: 'El titulo debe de ser un string' })
  @IsOptional()
  title: string;

  @IsOptional()
  @IsString()
  tag_name: string;

  @IsUUID()
  userId: string;
}
