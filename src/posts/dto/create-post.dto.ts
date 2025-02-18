import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PostEntity } from '../entities/post.entity';
import { OmitType } from '@nestjs/mapped-types';

export class CreatePostDto extends OmitType(PostEntity, [
  'id',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty({
    example: 'title example',
    description: 'post title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'content example',
    description: 'post content',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: ['source of first image', 'source of second image'],
    description: 'Array of images',
  })
  @IsNotEmpty()
  images: string[];
}
