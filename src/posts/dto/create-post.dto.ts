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
    example: 'content example',
    description: 'post content',
  })
  @IsString()
  @IsNotEmpty()
  caption: string;

  @ApiProperty({
    example: ['source of first image', 'source of second image'],
    description: 'Array of images',
  })
  @IsNotEmpty()
  images: string[];
}
