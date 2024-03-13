import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { GetUsers200ResponseOneOfInner, ManagementClient } from 'auth0'
import { Jwt, decode } from 'jsonwebtoken'

@Injectable()
export class Auth0Service {
  constructor(
    @Inject('MANAGEMENTCLIENT')
    private readonly managementClient: ManagementClient,
  ) {}

  public async getUser(
    auth0Id: string,
  ): Promise<GetUsers200ResponseOneOfInner> {
    try {
      const { data } = await this.managementClient.users.get({
        id: auth0Id,
      })
      return data
    } catch (e) {
      if (e.statusCode === 404) {
        throw new NotFoundException('User Not Found')
      }
      throw e
    }
  }

  public static getDecodedPayload(accessToken: string): Jwt {
    const decodedPayload = decode(accessToken, { complete: true })
    if (!decodedPayload || typeof decodedPayload === 'string') {
      throw new BadRequestException('Payload decoding failed')
    }
    return decodedPayload
  }
}
