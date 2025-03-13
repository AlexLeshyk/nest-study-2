import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiPropertyOptional({
    example: 'This is the updated comment',
    description: 'The updated content of the comment',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
