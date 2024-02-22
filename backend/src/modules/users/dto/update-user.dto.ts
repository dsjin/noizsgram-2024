import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class UpdateUserDto {
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username?: string

  @MaxLength(128)
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  bio?: string
}
