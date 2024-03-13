import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import {
  InvalidTokenError,
  UnauthorizedError,
  auth,
} from 'express-oauth2-jwt-bearer'
import { promisify } from 'util'
import { Auth0Service } from '../services/auth0/auth0.service'

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const res = context.switchToHttp().getResponse<Response>()

    const validate = promisify(auth())

    try {
      await validate(req, res)
      req['user'] = Auth0Service.getDecodedPayload(req.auth.token)
      return true
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        throw new UnauthorizedException('Bad credentials')
      }
      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException('Requires authentication')
      }
      throw new InternalServerErrorException()
    }
  }
}
