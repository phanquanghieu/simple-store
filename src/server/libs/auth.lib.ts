import { sign } from 'jsonwebtoken'

export interface IJWTPayload {
  username: string
}

export async function signJWT() {
  const jwt = sign(
    { username: process.env.ADMIN_USERNAME } as IJWTPayload,
    process.env.JWT_SECRET!,
    {
      expiresIn: '10d',
    },
  )

  return jwt
}
