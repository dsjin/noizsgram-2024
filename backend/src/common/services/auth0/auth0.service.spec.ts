import { Test, TestingModule } from '@nestjs/testing'
import { Auth0Service } from './auth0.service'
import { ApiResponse, GetUsers200ResponseOneOfInner } from 'auth0'
import managementClient from './auth0'

interface IAuth0ManagementClient {
  users: {
    get: jest.Mock<any, any, any>
  }
}

jest.mock('auth0', () => {
  return {
    ManagementClient: jest
      .fn()
      .mockImplementation((): IAuth0ManagementClient => {
        return {
          users: {
            get: jest.fn(),
          },
        }
      }),
  }
})

describe('Auth0Service', () => {
  let service: Auth0Service
  let managementClientProvider: IAuth0ManagementClient

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Auth0Service,
        {
          provide: 'MANAGEMENTCLIENT',
          useValue: managementClient,
        },
      ],
    }).compile()

    service = module.get<Auth0Service>(Auth0Service)
    managementClientProvider = module.get('MANAGEMENTCLIENT')
  })

  describe('getUser', () => {
    it('should return User data', async () => {
      const mockedData: ApiResponse<GetUsers200ResponseOneOfInner> = {
        data: {
          user_id: '',
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
        },
        headers: null,
        status: 200,
        statusText: 'ok',
      }
      managementClientProvider.users.get.mockReturnValue(mockedData)
      const returnedValue = await service.getUser('1234567890')
      expect(managementClientProvider.users.get).toHaveBeenCalledWith({
        id: '1234567890',
      })
      expect(returnedValue).toEqual(mockedData.data)
    })
    it('user not exists', async () => {
      managementClientProvider.users.get.mockRejectedValue({
        statusCode: 404
      })
      await expect(service.getUser('1234567890')).rejects.toThrow(
        'User Not Found',
      )
    })
  })
})
