import { Module } from '@nestjs/common'
import { TestsController } from './tests.controller'

@Module({
  imports: [],
  controllers: [TestsController],
  providers: [],
})
export class TestsModule {}
