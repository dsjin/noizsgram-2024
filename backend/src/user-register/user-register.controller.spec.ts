import { Test, TestingModule } from '@nestjs/testing'
import { UserRegisterController } from './user-register.controller'

describe('UserRegisterController', () => {
  let controller: UserRegisterController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRegisterController],
    }).compile()

    controller = module.get<UserRegisterController>(UserRegisterController)
  })

  describe('registerUser', () => {
    it ('should throw Auth0 validation error', () => {})
    it ('should return User data', () => {})
  })
})
