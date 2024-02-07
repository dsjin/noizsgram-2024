import { Test, TestingModule } from '@nestjs/testing'
import { UserRegisterController } from './user-register.controller'
import { UserRegisterService } from './user-register.service'
import { User } from '../../database/models/User.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Auth0Service } from '../../common/services/auth0/auth0.service'
import { AnyType } from '../../common/types/unittest'
import { BadRequestException, NotFoundException } from '@nestjs/common'

const repositoryMockFactory: () => AnyType<Repository<User>, jest.Mock<{}>> =
  jest.fn(() => ({}))

describe('UserRegisterController', () => {
  let controller: UserRegisterController
  let service: UserRegisterService

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
      controllers: [UserRegisterController],
    }).compile()

    controller = module.get<UserRegisterController>(UserRegisterController)
    service = module.get<UserRegisterService>(UserRegisterService)
  })

  describe('registerUser', () => {
    it('return registered data', async () => {
      const auth0Id = 'faf39fb5-7526-406e-8824-12712e39e38a'
      const createdData = {
        id: 1,
        auth0Id,
        username: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: null,
      } as User
      jest
        .spyOn(service, 'createUser')
        .mockImplementation(async () => createdData)
      expect(
        await controller.registerUser({
          auth0Id,
        }),
      ).toBe(createdData)
      expect(service.createUser).toHaveBeenCalledWith(auth0Id)
    })
    it('should throw NotFoundException', async () => {
      const auth0Id = 'faf39fb5-7526-406e-8824-12712e39e38a'
      jest.spyOn(service, 'createUser').mockImplementation(() => {
        throw new NotFoundException('User Not Found')
      })
      await expect(
        controller.registerUser({
          auth0Id,
        }),
      ).rejects.toThrow('User Not Found')
      expect(service.createUser).toHaveBeenCalledWith(auth0Id)
    })
    it('should throw BadRequestException:user exists', async () => {
      const auth0Id = 'faf39fb5-7526-406e-8824-12712e39e38a'
      jest.spyOn(service, 'createUser').mockImplementation(() => {
        throw new BadRequestException('User Exits')
      })
      await expect(
        controller.registerUser({
          auth0Id,
        }),
      ).rejects.toThrow('User Exits')
      expect(service.createUser).toHaveBeenCalledWith(auth0Id)
    })
  })
})
