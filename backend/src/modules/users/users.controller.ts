import { BadRequestException, Controller, Get, NotFoundException, Req } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { UsersService } from './users.service'
import { RequestWithUserClaim } from '../../common/types/request'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  async getAuthorizedUser(@Req() request: RequestWithUserClaim) {
    if (!request.user.sub) {
      throw new BadRequestException('Auth0 sub not exists')
    }
    const user = await this.userService.getUserByAuth0Id(request.user.sub)
    if (!user) {
      throw new NotFoundException('User not exists')
    }
    return user
  }
}
