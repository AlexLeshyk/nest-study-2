import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class QueryCommentDto {
  @ApiProperty({
    example: '93370d2e-ffd5-448b-a98f-f760d937c7d0',
    description: 'The post identifier to which the comment belongs',
  })
  @IsUUID()
  @IsNotEmpty()
  postId: string;
}
