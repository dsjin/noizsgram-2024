import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import {
  GetUsers200ResponseOneOfInner,
  ManagementClient,
  UserProfile,
} from 'auth0'

@Injectable()
export class Auth0Service {
  constructor(
    @Inject('MANAGEMENTCLIENT')
    private readonly managementClient: ManagementClient,
  ) {}

  public async getUser(
    auth0Id: string,
  ): Promise<GetUsers200ResponseOneOfInner> {
    const { data, status } = await this.managementClient.users.get({
      id: auth0Id,
    })
    if (status === 404) {
      throw new NotFoundException('User Not Found')
    }
    return data
  }
}
