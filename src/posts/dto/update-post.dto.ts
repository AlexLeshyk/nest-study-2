import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsOptional } from 'class-validator';
import { PostImage } from '../entities/post.entity';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiPropertyOptional({
    example: 'title',
    description: 'Post title, optional parameter',
  })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'content',
    description: 'Post content, optional parameter',
  })
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    example: [{ src: 'source of image', description: 'image description' }],
    description: 'Array of images, optional parameter',
  })
  @IsOptional()
  images?: PostImage[];
}
