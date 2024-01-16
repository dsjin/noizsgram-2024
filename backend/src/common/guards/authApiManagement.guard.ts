import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'

import * as dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/../.env' })

@Injectable()
export class AuthManagementAPIGuard implements CanActivate {
  private userRegisterApiKey: string

  constructor() {
    this.userRegisterApiKey = process.env.USER_REGISTER_API_KEY
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>()
    const { 'x-api-key': xApiKey } = req.headers
    if (!xApiKey || xApiKey !== this.userRegisterApiKey) {
      throw new UnauthorizedException('Bad credentials')
    }
    return true
  }
}
