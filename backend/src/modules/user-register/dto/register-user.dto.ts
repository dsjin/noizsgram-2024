import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class RegisterUser {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  auth0Id: string
}
