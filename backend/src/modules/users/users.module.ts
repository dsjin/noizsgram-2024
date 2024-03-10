import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../database/models/User.entity'
import { Auth0Service } from '../../common/services/auth0/auth0.service'
import { ManagementClient } from 'auth0'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    Auth0Service,
    {
      provide: 'MANAGEMENTCLIENT',
      useValue: ManagementClient,
    },
  ],
})
export class UsersModule {}
