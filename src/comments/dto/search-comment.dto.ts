import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SearchCommentDto {
  @ApiProperty({
    example: '93370d2e-ffd5-448b-a98f-f760d937c7d0',
    description: 'The comment identifier',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
