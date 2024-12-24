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

export const COOKIE_KEY_JWT_ADMIN = 'jwt-admin'
export const COOKIE_KEY_ADMIN_AUTHENTICATED = 'admin-authenticated'

interface IJwtPayloadAdmin {
  username: string
}
export const authService = {
  login: async ({ username, password }: ILoginReq) => {
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new BadRequestException('Username or password is incorrect')
    }

    const jwtToken = sign(
      { admin: { username: process.env.ADMIN_USERNAME } as IJwtPayloadAdmin },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1000d',
      },
    )
    const expiredAt = (decode(jwtToken) as JwtPayload).exp! * 1000

    const cookiesStore = await cookies()
    cookiesStore.set(COOKIE_KEY_JWT_ADMIN, jwtToken, {
      httpOnly: true,
      path: '/api/admin',
      secure: false,
      expires: expiredAt,
    })

    cookiesStore.set(COOKIE_KEY_ADMIN_AUTHENTICATED, 'true', {
      httpOnly: false,
      path: '/',
      secure: false,
      expires: expiredAt,
    })
  },

  logout: async () => {
    const cookiesStore = await cookies()
    cookiesStore.set(COOKIE_KEY_JWT_ADMIN, '', {
      path: '/api/admin',
      maxAge: 0,
    })

    cookiesStore.set(COOKIE_KEY_ADMIN_AUTHENTICATED, '', {
      path: '/',
      maxAge: 0,
    })
  },

  verifyJwt: async (): Promise<IJwtPayloadAdmin> => {
    const cookiesStore = await cookies()
    const jwtToken = cookiesStore.get(COOKIE_KEY_JWT_ADMIN)?.value
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
    return cookiesStore.get(COOKIE_KEY_ADMIN_AUTHENTICATED)?.value === 'true'
  },
}
