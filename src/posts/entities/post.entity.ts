/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MetaInfo {
  @ApiProperty({ example: 'Date', description: 'Post created date' })
  createdAt: string;

  @ApiProperty({ example: 'Date', description: 'Post updated date' })
  updatedAt?: string;
}

export class PostImage {
  @ApiProperty({
    example: 'source',
    description: 'Image source',
  })
  @IsNotEmpty()
  src: string;

  @ApiProperty({
    example: 'description',
    description: 'Image description for alt',
  })
  description: string;
}

export class PostModel {
  /* The identifier of post */
  @ApiProperty({ example: 1, description: 'Post identifier' })
  id: string;

  @ApiProperty({ example: 'Title', description: 'Post title' })
  title: string;

  @ApiProperty({ example: 'Body of content', description: 'Post content' })
  content: string;

  @ApiProperty({
    example: { createdAt: '19.02.2025', updatedAt: '19.02.2025' },
    description: 'Post meta info',
  })
  meta: MetaInfo;

  @ApiProperty({
    example: {
      array: [{ src: 'source of image', description: 'image description' }],
    },
    description: 'Array of images',
  })
  postImages?: PostImage[];
}
