'use client'

import { useTranslations } from 'next-intl'
import { useActionState } from 'react'
import { LuGithub } from 'react-icons/lu'

import { loginAction } from '~/server/actions/auth.action'

import { Button } from '~/app/_components/ui/button'
import { Input } from '~/app/_components/ui/input'
import { Spinner } from '~/app/_components/ui/spinner'

export default function LoginForm() {
  const [loginState, login, isLoading] = useActionState(loginAction, {
    data: {
      username: 'hieuneo',
      password: 'hieuneo',
    },
  })

  const t = useTranslations()

  return (
    <div className='grid gap-6'>
      <form action={login}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <Input
              autoCapitalize='none'
              autoCorrect='off'
              defaultValue={loginState.data.username}
              id='username'
              name='username'
              placeholder={t('Admin.Login.username')}
              type='text'
            />
            <p className='text-[0.8rem] font-medium text-destructive'>
              {loginState.detail?.username?.[0] &&
                t(
                  `Admin.Login.FormError.username.${loginState.detail?.username?.[0]}` as TMessageKey,
                )}
            </p>
          </div>
          <div className='grid gap-1'>
            <Input
              autoCapitalize='none'
              autoCorrect='off'
              defaultValue={loginState.data.password}
              id='password'
              name='password'
              placeholder={t('Admin.Login.password')}
              type='password'
            />
            <p className='text-[0.8rem] font-medium text-destructive'>
              {loginState.detail?.password?.[0] &&
                t(
                  `Admin.Login.FormError.password.${loginState.detail?.password?.[0]}` as TMessageKey,
                )}
            </p>
          </div>
          <p className='text-[0.8rem] font-medium text-destructive'>
            {loginState.detail?._error?.[0] &&
              t(
                `Admin.Login.FormError.${loginState.detail?._error?.[0]}` as TMessageKey,
              )}
          </p>
          <Button disabled={isLoading} type='submit'>
            {isLoading ? <Spinner /> : <div className='h-4 w-4' />}
            {t('Admin.Login.signIn')}
            <div className='h-4 w-4' />
          </Button>
        </div>
      </form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-primary-foreground px-2'>
            {t('Admin.Login.orContinueWith')}
          </span>
        </div>
      </div>
      <Button disabled={isLoading} type='button' variant='outline'>
        <LuGithub /> GitHub
      </Button>
    </div>
  )
}
