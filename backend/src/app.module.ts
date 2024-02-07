import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { typeOrmConfig } from './typeorm.config'
import { TestsModule } from './modules/tests/tests.module'
import { UsersModule } from './modules/users/users.module'
import { UserRegisterService } from './modules/user-register/user-register.service'
import { UserRegisterController } from './modules/user-register/user-register.controller'
import { UserRegisterModule } from './modules/user-register/user-register.module'
import { Auth0Service } from './common/services/auth0/auth0.service'
import managementClient from './common/services/auth0/auth0'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TestsModule,
    UsersModule,
    UserRegisterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
