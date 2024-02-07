import { Controller, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from 'src/common/guards/auth.guard'

@Controller('users')
export class UsersController {}
