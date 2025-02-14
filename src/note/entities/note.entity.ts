import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  description: string;

  @Column({ nullable: true })
  title: string;

  @Column({ default: false })
  archived: boolean;

  @ManyToOne(() => Tag, (tag) => tag.notes, {
    eager: true,
  })
  @JoinColumn({ name: 'tagId' })
  tag: Tag | null;

  @Column({ nullable: true })
  tagId: number;

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  userId: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
