import Link from 'next/link'

import LoginForm from './LoginForm'

export default function AdminLoginPage() {
  return (
    <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>Sign In</h1>
        <p className='text-sm'>
          Enter your email and password below to sign in
        </p>
      </div>
      <LoginForm />
      <p className='px-8 text-center text-sm'>
        By clicking continue, you agree to our{' '}
        <Link
          href='#'
          className='underline underline-offset-4 hover:opacity-50'
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href='#'
          className='underline underline-offset-4 hover:opacity-50'
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}
