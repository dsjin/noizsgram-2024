import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { RegisterUser } from './dto/register-user.dto'
import { ApiHeader, ApiTags } from '@nestjs/swagger'
import { UserRegisterService } from './user-register.service'
import { AuthManagementAPIGuard } from '../../common/guards/authApiManagement.guard'

@ApiTags('user-register')
@Controller('user-register')
@ApiHeader({
  name: 'x-api-key',
})
@UseGuards(AuthManagementAPIGuard)
export class UserRegisterController {
  constructor(private readonly userRegisterService: UserRegisterService) {}
  @Post()
  async registerUser(@Body() data: RegisterUser) {
    return this.userRegisterService.createUser(data.auth0Id)
  }
}
