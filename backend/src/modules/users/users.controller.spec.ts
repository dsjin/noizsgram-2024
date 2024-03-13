import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { User } from '../../database/models/User.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AnyType } from '../../common/types/unittest'
import { Repository } from 'typeorm'
import { UsersService } from './users.service'
import { Jwt, JwtPayload } from 'jsonwebtoken'
import { createRequest } from 'node-mocks-http'
import { RequestWithUserClaim } from '../../common/types/request'

const repositoryMockFactory: () => AnyType<Repository<User>, jest.Mock<{}>> =
  jest.fn(() => ({}))

describe('UsersController', () => {
  let controller: UsersController
  let usersService: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ]
    }).compile()

    controller = module.get<UsersController>(UsersController)
    usersService = module.get<UsersService>(UsersService)
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
      const jwt: Jwt = {                                                                                                                     
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
      const req: RequestWithUserClaim = createRequest()
      req.user = jwt.payload as JwtPayload
      jest.spyOn(usersService, 'getUserByAuth0Id').mockResolvedValue(userData)
      expect(await controller.getAuthorizedUser(req)).toBe(userData)
      expect(usersService.getUserByAuth0Id).toHaveBeenCalledWith(auth0Id)
    })
    it ('sub not exists' , async () => {
      const jwt: Jwt = {                                                                                                                     
        header: { alg: 'HS256', typ: 'JWT' },
        payload: {
          iss: 'https://xxx.auth0.com/',
          sub: null,
          aud: 'aud',
          iat: 1709780210,
          exp: 1709866610,
          azp: 'azp',
          gty: 'client-credentials'
        },
        signature: 'xxxxx'
      }
      const req: RequestWithUserClaim = createRequest()
      req.user = jwt.payload as JwtPayload
      jest.spyOn(usersService, 'getUserByAuth0Id')
      await expect(controller.getAuthorizedUser(req)).rejects.toThrow(
        'Auth0 sub not exists',
      )
      expect(usersService.getUserByAuth0Id).toHaveBeenCalledTimes(0)
    })
    it ('user not found' , async () => {
      const auth0Id = 'faf39fb5-7526-406e-8824-12712e39e38a'
      const jwt: Jwt = {                                                                                                                     
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
      const req: RequestWithUserClaim = createRequest()
      req.user = jwt.payload as JwtPayload
      jest.spyOn(usersService, 'getUserByAuth0Id').mockResolvedValue(undefined)
      await expect(controller.getAuthorizedUser(req)).rejects.toThrow(
        'User not exists',
      )
      expect(usersService.getUserByAuth0Id).toHaveBeenCalledWith(auth0Id)
    })
  })
  // describe('updateAuthorizedUser', () => {})
  // describe('checkUser', () => {})
})
