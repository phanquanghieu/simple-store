'use client'

import { useActionState } from 'react'
import { LuGithub } from 'react-icons/lu'

import { loginAction } from '~/server/actions/auth.action'

import { Button } from '~/app/_components/ui/button'
import { Input } from '~/app/_components/ui/input'
import { Label } from '~/app/_components/ui/label'
import { Spinner } from '~/app/_components/ui/spinner'

export default function LoginForm() {
  const [loginState, login, isLoading] = useActionState(loginAction, {
    data: {
      username: 'hieuneo',
      password: 'hieuneo',
    },
  })

  return (
    <div className='grid gap-6'>
      <form action={login}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='username'>
              Username
            </Label>
            <Input
              id='username'
              name='username'
              defaultValue={loginState.data.username}
              placeholder='Email'
              type='text'
              autoCapitalize='none'
              autoCorrect='off'
            />
            <p className='text-[0.8rem] font-medium text-destructive'>
              {loginState.detail?.username?.[0]}
            </p>
          </div>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='username'>
              Username
            </Label>
            <Input
              id='password'
              name='password'
              defaultValue={loginState.data.password}
              placeholder='Password'
              type='password'
              autoCapitalize='none'
              autoCorrect='off'
            />
            <p className='text-[0.8rem] font-medium text-destructive'>
              {loginState.detail?.password?.[0]}
            </p>
          </div>
          <p className='text-[0.8rem] font-medium text-destructive'>
            {loginState.detail?._error?.[0]}
          </p>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? <Spinner /> : <div className='h-4 w-4' />}
            Sign In
            <div className='h-4 w-4' />
          </Button>
        </div>
      </form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-primary-foreground px-2'>Or continue with</span>
        </div>
      </div>
      <Button variant='outline' type='button' disabled={isLoading}>
        <LuGithub /> GitHub
      </Button>
    </div>
  )
}
