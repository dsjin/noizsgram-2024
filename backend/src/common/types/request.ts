import { JwtPayload } from 'jsonwebtoken'
import { Request } from 'express'

export type UserClaim = {
  user: JwtPayload
}

export type RequestWithUserClaim = Request & UserClaim
