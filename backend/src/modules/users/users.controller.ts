import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  // constructor(private readonly userService: UsersService) {}
  @Get()
  async getAuthorizedUser() {
    return null
  }
}
