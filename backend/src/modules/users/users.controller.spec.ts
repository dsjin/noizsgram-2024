import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { User } from '../../database/models/User.entity'
import { Auth0Service } from '../../common/services/auth0/auth0.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AnyType } from '../../common/types/unittest'
import { Repository } from 'typeorm'
import { UsersService } from './users.service'
import { JwtPayload } from 'jsonwebtoken'

const repositoryMockFactory: () => AnyType<Repository<User>, jest.Mock<{}>> =
  jest.fn(() => ({}))

describe('UsersController', () => {
  let controller: UsersController
  let usersService: UsersService
  let auth0Service: Auth0Service

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        Auth0Service,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: 'MANAGEMENTCLIENT',
          useValue: null,
        },
      ]
    }).compile()

    controller = module.get<UsersController>(UsersController)
    usersService = module.get<UsersService>(UsersService)
    auth0Service = module.get<Auth0Service>(Auth0Service)
  })

  describe('getAuthorizedUser', () => {
    it ('return an authorized user', async () => {
      const auth0Id = 'faf39fb5-7526-406e-8824-12712e39e38a'
      const userData = {
        id: 1,
        auth0Id,
        username: 'username',
        bio: 'Hello World!',
        createdAt: new Date(),
        updatedAt: null,
      } as User
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3h4eC5hdXRoMC5jb20vIiwic3ViIjoic3ViIiwiYXVkIjoiYXVkIiwiaWF0IjoxNzA5NzgwMjEwLCJleHAiOjE3MDk4NjY2MTAsImF6cCI6ImF6cCIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.ugfbuOCrjCm8kPlSELcBJda3LadB-GhdMLcluovt32M'
      const jwtPayload: JwtPayload = {                                                                                                                     
        header: { alg: 'HS256', typ: 'JWT' },
        payload: {
          iss: 'https://xxx.auth0.com/',
          sub: auth0Id,
          aud: 'aud',
          iat: 1709780210,
          exp: 1709866610,
          azp: 'azp',
          gty: 'client-credentials'
        },
        signature: 'xxxxx'
      }
      jest.spyOn(auth0Service, 'getDecodedPayload').mockReturnValue(jwtPayload)
      expect(await controller.getAuthorizedUser()).toBe(null)
    })
  })
  // describe('updateAuthorizedUser', () => {})
  // describe('checkUser', () => {})
})
