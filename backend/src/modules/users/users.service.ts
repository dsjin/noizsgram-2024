import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../database/models/User.entity'
import { Repository } from 'typeorm'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async getUserByAuth0Id(auth0Id: string) {
    return this.userRepository.findOne({
      where: {
        auth0Id,
      },
    })
  }
  async getUserByUsername(username: string) {
    return this.userRepository.findOne({
      where: {
        username,
      },
    })
  }
  async updateUser(item: User, data: UpdateUserDto) {
    if (data.username) {
      if (await this.getUserByUsername(data.username)) {
        throw new BadRequestException('Username exists')
      }
    }
    item = this.userRepository.merge(item, data)
    return this.userRepository.save(item)
  }
}
