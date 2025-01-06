import { cookies } from 'next/headers'

import {
  JwtPayload,
  TokenExpiredError,
  decode,
  sign,
  verify,
} from 'jsonwebtoken'

import { ILoginReq } from '../../shared/dto/auth/req'
import {
  BadRequestException,
  UnauthorizedException,
} from '../common/exceptions/exceptions'

const COOKIE_EXPIRED_IN = '1000d'
export const COOKIE_NAME_ADMIN_JWT = 'ss-admin-jwt'
export const COOKIE_NAME_ADMIN_AUTHENTICATED = 'ss-admin-authenticated'

interface IJwtPayloadAdmin {
  username: string
}
export const authService = {
  login: async ({ username, password }: ILoginReq) => {
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new BadRequestException('INVALID_CREDENTIALS')
    }

    const jwtToken = sign(
      { admin: { username: process.env.ADMIN_USERNAME } as IJwtPayloadAdmin },
      process.env.JWT_SECRET!,
      {
        expiresIn: COOKIE_EXPIRED_IN,
      },
    )
    const expiredAt = (decode(jwtToken) as JwtPayload).exp! * 1000

    const cookiesStore = await cookies()
    cookiesStore.set(COOKIE_NAME_ADMIN_JWT, jwtToken, {
      httpOnly: true,
      path: '/api/admin',
      secure: false,
      expires: expiredAt,
    })

    cookiesStore.set(COOKIE_NAME_ADMIN_AUTHENTICATED, 'true', {
      httpOnly: false,
      path: '/',
      secure: false,
      expires: expiredAt,
    })
  },

  logout: async () => {
    const cookiesStore = await cookies()
    cookiesStore.set(COOKIE_NAME_ADMIN_JWT, '', {
      path: '/api/admin',
      maxAge: 0,
    })

    cookiesStore.set(COOKIE_NAME_ADMIN_AUTHENTICATED, '', {
      path: '/',
      maxAge: 0,
    })
  },

  verifyJwt: async (): Promise<IJwtPayloadAdmin> => {
    const cookiesStore = await cookies()
    const jwtToken = cookiesStore.get(COOKIE_NAME_ADMIN_JWT)?.value
    if (!jwtToken) {
      throw new UnauthorizedException()
    }

    try {
      const { admin } = verify(jwtToken, process.env.JWT_SECRET!) as {
        admin: IJwtPayloadAdmin
      }
      return admin
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('TokenExpiredError')
      } else {
        throw new UnauthorizedException()
      }
    }
  },

  checkIsAuthenticated: async (): Promise<boolean> => {
    const cookiesStore = await cookies()
    return cookiesStore.get(COOKIE_NAME_ADMIN_AUTHENTICATED)?.value === 'true'
  },
}
