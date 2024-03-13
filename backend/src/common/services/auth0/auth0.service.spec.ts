import { Test, TestingModule } from '@nestjs/testing'
import { Auth0Service } from './auth0.service'
import { ApiResponse, GetUsers200ResponseOneOfInner } from 'auth0'
import * as jsonwebtoken from 'jsonwebtoken'
import managementClient from './auth0'

interface IAuth0ManagementClient {
  users: {
    get: jest.Mock<any, any, any>
  }
}

interface IJsonwebtoken {
  decode: jest.Mock<any, any, any>
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

jest.mock('jsonwebtoken', () => {
  return {
    decode: jest.fn(),
  }
})

const jsonwebtokenMock = jsonwebtoken as jest.Mocked<typeof jsonwebtoken>

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
        statusCode: 404,
      })
      await expect(service.getUser('1234567890')).rejects.toThrow(
        'User Not Found',
      )
    })
  })
  describe('getDecodedPayload', () => {
    it('should return decoded payload', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3h4eC5hdXRoMC5jb20vIiwic3ViIjoic3ViIiwiYXVkIjoiYXVkIiwiaWF0IjoxNzA5NzgwMjEwLCJleHAiOjE3MDk4NjY2MTAsImF6cCI6ImF6cCIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.ugfbuOCrjCm8kPlSELcBJda3LadB-GhdMLcluovt32M'
      const returnedValue: jsonwebtoken.Jwt = {                                                                                                                     
        header: { alg: 'HS256', typ: 'JWT' },
        payload: {
          iss: 'https://xxx.auth0.com/',
          sub: 'sub',
          aud: 'aud',
          iat: 1709780210,
          exp: 1709866610,
          azp: 'azp',
          gty: 'client-credentials'
        },
        signature: 'xxxxx'
      }
      jsonwebtokenMock.decode.mockReturnValue(returnedValue)
      expect(Auth0Service.getDecodedPayload(token)).toEqual(returnedValue)
      expect(jsonwebtokenMock.decode).toHaveBeenCalledWith(token, {
        'complete': true
      })
    })
    it('payload decoded failure: string', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3h4eC5hdXRoMC5jb20vIiwic3ViIjoic3ViIiwiYXVkIjoiYXVkIiwiaWF0IjoxNzA5NzgwMjEwLCJleHAiOjE3MDk4NjY2MTAsImF6cCI6ImF6cCIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.ugfbuOCrjCm8kPlSELcBJda3LadB-GhdMLcluovt32M'
      jsonwebtokenMock.decode.mockReturnValue('string')
      expect(() => Auth0Service.getDecodedPayload(token)).toThrow(
        'Payload decoding failed',
      )
    })
    it('payload decoded failure: null', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3h4eC5hdXRoMC5jb20vIiwic3ViIjoic3ViIiwiYXVkIjoiYXVkIiwiaWF0IjoxNzA5NzgwMjEwLCJleHAiOjE3MDk4NjY2MTAsImF6cCI6ImF6cCIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.ugfbuOCrjCm8kPlSELcBJda3LadB-GhdMLcluovt32M'
      jsonwebtokenMock.decode.mockReturnValue(null)
      expect(() => Auth0Service.getDecodedPayload(token)).toThrow(
        'Payload decoding failed',
      )
    })
  })
})
