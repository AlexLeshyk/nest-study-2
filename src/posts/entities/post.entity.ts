import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

export class MetaInfo {
  @ApiProperty({ example: 'Date', description: 'Post created date' })
  createdAt: string;

  @ApiProperty({ example: 'Date', description: 'Post updated date' })
  updatedAt?: string;
}

@Entity()
export class PostModel extends MetaInfo {
  /* The identifier of post */
  @ApiProperty({ example: 1, description: 'Post identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Title', description: 'Post title' })
  @Column()
  title: string;

  @ApiProperty({ example: 'Body of content', description: 'Post content' })
  @Column()
  content: string;

  @ApiProperty({ example: 'Date', description: 'Post created date' })
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty({ example: 'Date', description: 'Post updated date' })
  @UpdateDateColumn()
  updatedAt?: string;

  @ApiProperty({
    example: ['source of first image', 'source of second image'],
    description: 'Array of images',
  })
  @Column({ type: 'text', array: true, default: [] })
  images?: string[];
}
