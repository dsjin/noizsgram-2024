import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { GetUsers200ResponseOneOfInner, ManagementClient } from 'auth0'

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
}
