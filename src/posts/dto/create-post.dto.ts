import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PostModel } from '../entities/post.entity';
import { OmitType } from '@nestjs/mapped-types';

export class CreatePostDto extends OmitType(PostModel, [
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
  @IsOptional()
  images?: string[];
}
