import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { CommentEntity } from '../entities/comment.entity';
import { OmitType } from '@nestjs/mapped-types';

export class CreateCommentDto extends OmitType(CommentEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'postId',
]) {
  @ApiProperty({
    example: 'This is a new comment',
    description: 'The content of the comment',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiPropertyOptional({
    example: '93370d2e-ffd5-448b-a98f-f760d937c7d0',
    description: 'The parent comment identifier to which the comment belongs',
  })
  @IsUUID()
  @IsOptional()
  parentCommentId?: string;
}
