import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/common/guards/auth.guard'

@ApiTags('tests')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tests')
@UseInterceptors(ClassSerializerInterceptor)
export class TestsController {
  @Get()
  getHello() {
    return 'Hello World'
  }
}
