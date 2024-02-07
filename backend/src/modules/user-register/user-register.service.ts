import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../database/models/User.entity'
import { Auth0Service } from '../../common/services/auth0/auth0.service'

@Injectable()
export class UserRegisterService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly auth0Service: Auth0Service,
  ) {}

  async getUserByAuth0Id(auth0Id: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        auth0Id,
      },
    })
  }

  async createUser(auth0Id: string) {
    const user = await this.getUserByAuth0Id(auth0Id)
    if (user) {
      throw new BadRequestException('User Exits')
    }
    await this.auth0Service.getUser(auth0Id)
    return this.userRepository.save({
      auth0Id,
    })
  }
}
