import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsOptional } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiPropertyOptional({
    example: 'content',
    description: 'Post content, optional parameter',
  })
  @IsOptional()
  caption?: string;

  @ApiPropertyOptional({
    example: ['source of image one', 'source of image one'],
    description: 'Array of images source, optional parameter',
  })
  @IsOptional()
  images?: string[];
}
