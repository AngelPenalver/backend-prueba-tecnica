import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty({ message: 'El nombre de la etiqueta no puede estar vacio' })
  @IsString({ message: "Debe de ser un string" })
  name: string;
}
