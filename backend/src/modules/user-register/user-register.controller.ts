import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthManagementAPIGuard } from 'src/common/guards/authApiManagement.guard'
import { RegisterUser } from './dto/register-user.dto'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiTags('user-register')
@Controller('user-register')
@ApiHeader({
  name: 'x-api-key'
})
@UseGuards(AuthManagementAPIGuard)
export class UserRegisterController {
  @Post()
  registerUser(
    @Body() data: RegisterUser
  ) {
    return data
  }
}
