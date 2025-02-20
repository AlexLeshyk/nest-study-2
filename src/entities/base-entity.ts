import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @ApiProperty({ example: 'Date', description: 'Post created date' })
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty({ example: 'Date', description: 'Post updated date' })
  @UpdateDateColumn()
  updatedAt: string;
}
