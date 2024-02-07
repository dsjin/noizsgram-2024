import { Test, TestingModule } from '@nestjs/testing'
import { UserRegisterService } from './user-register.service'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '../../database/models/User.entity'
import { Auth0Service } from '../../common/services/auth0/auth0.service'
import { NotFoundException } from '@nestjs/common'
import { AnyType } from '../../common/types/unittest'

const repositoryMockFactory: () => AnyType<Repository<User>, jest.Mock<{}>> =
  jest.fn(() => ({
    save: jest.fn((entity) => entity),
    findOne: jest.fn(),
  }))

describe('UserRegisterService', () => {
  let userRegisterService: UserRegisterService
  let auth0Service: Auth0Service
  let repositoryMock: AnyType<Repository<User>, jest.Mock<{}>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRegisterService,
        Auth0Service,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: 'MANAGEMENTCLIENT',
          useValue: null,
        },
      ],
    }).compile()

    userRegisterService = module.get<UserRegisterService>(UserRegisterService)
    auth0Service = module.get<Auth0Service>(Auth0Service)
    repositoryMock = module.get(getRepositoryToken(User))
  })

  describe('getUserByAuth0Id', () => {
    it('should return user data', async () => {
      const auth0Id = 'faf39fb5-7526-406e-8824-12712e39e38a'
      const userData = {
        id: 1,
        auth0Id,
        username: 'example',
        bio: 'Hello World!',
        createdAt: new Date(),
        updatedAt: null,
      } as User
      repositoryMock.findOne.mockReturnValue(userData)
      expect(await userRegisterService.getUserByAuth0Id(auth0Id)).toBe(userData)
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          auth0Id,
        },
      })
    })
    it('should return empty', async () => {
      const auth0Id = 'faf39fb5-7526-406e-8824-12712e39e38b'
      repositoryMock.findOne.mockReturnValue(undefined)
      expect(await userRegisterService.getUserByAuth0Id(auth0Id)).toBe(
        undefined,
      )
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          auth0Id,
        },
      })
    })
  })

  describe('createUser', () => {
    it('should return created data', async () => {
      const auth0Id = 'faf39fb5-7526-406e-8824-12712e39e38a'
      const auth0Data = {
        user_id: 'faf39fb5-7526-406e-8824-12712e39e38a',
        email: '',
        email_verified: true,
        username: '',
        phone_number: '',
        phone_verified: true,
        created_at: {},
        updated_at: {},
        identities: [],
        app_metadata: null,
        user_metadata: null,
        picture: '',
        name: '',
        nickname: '',
        multifactor: null,
        last_ip: null,
        last_login: null,
        logins_count: 0,
        blocked: false,
        given_name: '',
        family_name: '',
      }
      const createdData = {
        id: 1,
        auth0Id,
        username: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: null,
      } as User
      jest
        .spyOn(userRegisterService, 'getUserByAuth0Id')
        .mockReturnValue(undefined)
      jest
        .spyOn(auth0Service, 'getUser')
        .mockImplementation(async () => auth0Data)
      repositoryMock.save.mockReturnValue(createdData)
      expect(await userRegisterService.createUser(auth0Id)).toBe(createdData)
      expect(auth0Service.getUser).toHaveBeenCalledWith(auth0Id)
      expect(repositoryMock.save).toHaveBeenCalledWith({
        auth0Id,
      })
    })
    it('should throw NotFoundException', async () => {
      const auth0Id = 'faf39fb5-7526-406e-8824-12712e39e38a'
      jest.spyOn(auth0Service, 'getUser').mockImplementation(() => {
        throw new NotFoundException('User Not Found')
      })
      jest
        .spyOn(userRegisterService, 'getUserByAuth0Id')
        .mockReturnValue(undefined)
      await expect(userRegisterService.createUser(auth0Id)).rejects.toThrow(
        'User Not Found',
      )
      expect(auth0Service.getUser).toHaveBeenCalledWith(auth0Id)
      expect(repositoryMock.save).toHaveBeenCalledTimes(0)
    })
    it('should throw BadRequestException:user exists', async () => {
      const auth0Id = 'faf39fb5-7526-406e-8824-12712e39e38a'
      const userData = {
        id: 1,
        auth0Id,
        username: 'example',
        bio: 'Hello World!',
        createdAt: new Date(),
        updatedAt: null,
      }
      jest
        .spyOn(userRegisterService, 'getUserByAuth0Id')
        .mockResolvedValue(userData)
      jest.spyOn(auth0Service, 'getUser')
      await expect(userRegisterService.createUser(auth0Id)).rejects.toThrow(
        'User Exits',
      )
      expect(userRegisterService.getUserByAuth0Id).toHaveBeenCalledWith(auth0Id)
      expect(auth0Service.getUser).toHaveBeenCalledTimes(0)
      expect(repositoryMock.save).toHaveBeenCalledTimes(0)
    })
  })
})
