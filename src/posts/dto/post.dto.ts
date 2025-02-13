/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { PostImage } from '../entities/post.entity';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePostDto {
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
    example: {
      array: [{ src: 'source of image', description: 'image description' }],
    },
    description: 'Array of images',
  })
  @ValidateNested()
  @Type(() => PostImage)
  images?: PostImage[];
}

export class UpdatePostDto {
  @ApiProperty({
    example: 'title example',
    description: 'post title',
  })
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'content example',
    description: 'post content',
  })
  @IsString()
  content?: string;

  @ApiProperty({
    example: {
      array: [{ src: 'source of image', description: 'image description' }],
    },
    description: 'Array of images',
  })
  images?: PostImage[];
}
