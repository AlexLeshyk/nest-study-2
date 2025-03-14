import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example:
      '6b70c1d0cf3d38060fc510d01c8c018298f5a79b707173b2358f7b5a8c2e8d852e41072d59463bbc12beada79ad0eab851fdc4da840d299098c342d1930243b7',
    description: 'Refresh token',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
