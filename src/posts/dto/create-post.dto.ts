import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PostImage, PostModel } from '../entities/post.entity';
import { OmitType } from '@nestjs/mapped-types';

export class CreatePostDto extends OmitType(PostModel, ['id', 'meta']) {
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
    example: [{ src: 'source of image', description: 'image description' }],
    description: 'Array of images',
  })
  @ValidateNested()
  @Type(() => PostImage)
  images?: PostImage[];
}
