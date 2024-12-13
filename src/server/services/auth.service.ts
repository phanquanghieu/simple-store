import { cookies } from 'next/headers'

import {
  JwtPayload,
  TokenExpiredError,
  decode,
  sign,
  verify,
} from 'jsonwebtoken'

import {
  BadRequestException,
  UnauthorizedException,
} from '../common/exceptions/exceptions'

export const COOKIE_KEY_ADMIN_JWT = 'admin-jwt'

export interface IAdminJwtPayload {
  username: string
}

export interface ILoginRequest {
  username: string
  password: string
}

async function login({ username, password }: ILoginRequest) {
  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    throw new BadRequestException('Invalid username or password')
  }

  const jwtToken = sign(
    { username: process.env.ADMIN_USERNAME } as IAdminJwtPayload,
    process.env.JWT_SECRET!,
    {
      expiresIn: '1d',
    },
  )
  const jwtDecoded = decode(jwtToken) as JwtPayload

  const cookiesStore = await cookies()
  cookiesStore.set(COOKIE_KEY_ADMIN_JWT, jwtToken, {
    httpOnly: true,
    path: '/api',
    secure: false,
    expires: jwtDecoded.exp! * 1000,
  })
}

async function logout() {
  const cookiesStore = await cookies()
  cookiesStore.delete(COOKIE_KEY_ADMIN_JWT)
}

async function verifyJwt(): Promise<IAdminJwtPayload> {
  const cookiesStore = await cookies()
  const jwtToken = cookiesStore.get(COOKIE_KEY_ADMIN_JWT)?.value
  if (!jwtToken) {
    throw new UnauthorizedException()
  }

  try {
    const admin = verify(jwtToken, process.env.JWT_SECRET!) as IAdminJwtPayload
    return admin
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedException('TokenExpiredError')
    } else {
      throw new UnauthorizedException()
    }
  }
}

export const authService = {
  login,
  logout,
  verifyJwt,
}
