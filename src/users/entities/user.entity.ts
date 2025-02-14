import { Note } from "src/note/entities/note.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true, nullable: false })
    email: string;

    @OneToMany(() => Note, (note) => note.user)
    notes: Note[];

    @Column({nullable: false})
    password: string;
}
