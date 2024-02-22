import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { AnyType } from '../../common/types/unittest'
import { Repository } from 'typeorm'
import { User } from '../../database/models/User.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { BadRequestException } from '@nestjs/common'

const repositoryMockFactory: () => AnyType<Repository<User>, jest.Mock<{}>> =
  jest.fn(() => ({
    save: jest.fn((entity) => entity),
    merge: jest.fn(),
    findOne: jest.fn(),
  }))

describe('UsersService', () => {
  let service: UsersService
  let repositoryMock: AnyType<Repository<User>, jest.Mock<{}>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
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
      expect(await service.getUserByAuth0Id(auth0Id)).toBe(userData)
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          auth0Id,
        },
      })
    })
    it('should return empty', async () => {
      const auth0Id = 'faf39fb5-7526-406e-8824-12712e39e38b'
      repositoryMock.findOne.mockReturnValue(undefined)
      expect(await service.getUserByAuth0Id(auth0Id)).toBe(undefined)
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          auth0Id,
        },
      })
    })
  })
  describe('getUserByUsername', () => {
    it('should return user data', async () => {
      const username = 'example'
      const userData = {
        id: 1,
        auth0Id: 'faf39fb5-7526-406e-8824-12712e39e38a',
        username,
        bio: 'Hello World!',
        createdAt: new Date(),
        updatedAt: null,
      } as User
      repositoryMock.findOne.mockReturnValue(userData)
      expect(await service.getUserByUsername(username)).toBe(userData)
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          username,
        },
      })
    })
    it('should return empty', async () => {
      const username = 'example'
      repositoryMock.findOne.mockReturnValue(undefined)
      expect(await service.getUserByUsername(username)).toBe(undefined)
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          username,
        },
      })
    })
  })
  describe('updateUser', () => {
    it('should return updated data : updating all possible properties', async () => {
      const auth0Id = 'faf39fb5-7526-406e-8824-12712e39e38a'
      const targetData = {
        id: 1,
        auth0Id,
        username: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: null,
      } as User
      const updatedData = {
        id: 1,
        auth0Id,
        username: 'test',
        bio: 'test',
        createdAt: targetData.createdAt,
        updatedAt: new Date(),
      } as User
      const data = {
        username: 'test',
        bio: 'test',
      }
      repositoryMock.merge.mockReturnValue(updatedData)
      jest.spyOn(service, 'getUserByUsername').mockResolvedValue(undefined)

      expect(await service.updateUser(targetData, data)).toEqual(updatedData)
      expect(service.getUserByUsername).toHaveBeenCalledWith('test')
      expect(repositoryMock.merge).toHaveBeenCalledWith(targetData, data)
    })
    it('should return updated data : updating username properties', async () => {
      const auth0Id = 'faf39fb5-7526-406e-8824-12712e39e38a'
      const targetData = {
        id: 1,
        auth0Id,
        username: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: null,
      } as User
      const updatedData = {
        id: 1,
        auth0Id,
        username: 'test',
        bio: null,
        createdAt: targetData.createdAt,
        updatedAt: new Date(),
      } as User
      const data = {
        username: 'test',
      }
      repositoryMock.merge.mockReturnValue(updatedData)
      jest.spyOn(service, 'getUserByUsername').mockResolvedValue(undefined)

      expect(await service.updateUser(targetData, data)).toEqual(updatedData)
      expect(service.getUserByUsername).toHaveBeenCalledWith('test')
      expect(repositoryMock.merge).toHaveBeenCalledWith(targetData, data)
    })
    it('should return updated data : updating bio properties', async () => {
      const auth0Id = 'faf39fb5-7526-406e-8824-12712e39e38a'
      const targetData = {
        id: 1,
        auth0Id,
        username: 'test',
        bio: null,
        createdAt: new Date(),
        updatedAt: null,
      } as User
      const updatedData = {
        id: 1,
        auth0Id,
        username: 'test',
        bio: 'test',
        createdAt: targetData.createdAt,
        updatedAt: new Date(),
      } as User
      const data = {
        bio: 'test',
      }
      repositoryMock.merge.mockReturnValue(updatedData)
      jest.spyOn(service, 'getUserByUsername')

      expect(await service.updateUser(targetData, data)).toEqual(updatedData)
      expect(service.getUserByUsername).toHaveBeenCalledTimes(0)
      expect(repositoryMock.merge).toHaveBeenCalledWith(targetData, data)
    })
    it('should BadRequest : existing username', async () => {
      const auth0Id = 'faf39fb5-7526-406e-8824-12712e39e38a'
      const targetData = {
        id: 1,
        auth0Id,
        username: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: null,
      } as User
      const existingData = {
        id: 2,
        auth0Id,
        username: 'test',
        bio: 'test',
        createdAt: new Date(),
        updatedAt: null,
      } as User
      const data = {
        username: 'test',
      }
      jest.spyOn(service, 'getUserByUsername').mockResolvedValue(existingData)
      await expect(service.updateUser(targetData, data)).rejects.toThrow(
        'Username exists',
      )
      expect(service.getUserByUsername).toHaveBeenCalledTimes(1)
      expect(repositoryMock.merge).toHaveBeenCalledTimes(0)
    })
  })
})
