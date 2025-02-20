import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/entities/base-entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'posts' })
export class PostEntity extends BaseEntity {
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

  @ApiProperty({
    example: ['source of first image', 'source of second image'],
    description: 'Array of images',
  })
  @Column({ type: 'text', array: true, default: [] })
  images: string[];
}
