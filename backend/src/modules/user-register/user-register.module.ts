import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../database/models/User.entity'
import { Auth0Service } from '../../common/services/auth0/auth0.service'
import { UserRegisterService } from './user-register.service'
import { UserRegisterController } from './user-register.controller'
import managementClient from '../../common/services/auth0/auth0'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    Auth0Service,
    UserRegisterService,
    {
      provide: 'MANAGEMENTCLIENT',
      useValue: managementClient,
    },
  ],
  controllers: [UserRegisterController],
})
export class UserRegisterModule {}
