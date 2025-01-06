import { useTranslations } from 'next-intl'

import LoginForm from './LoginForm'

export default function AdminLoginPage() {
  const t = useTranslations()

  return (
    <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          {t('Admin.LoginPage.signIn')}
        </h1>
        <p className='text-sm'>{t('Admin.LoginPage.description')}</p>
      </div>
      <LoginForm />
    </div>
  )
}
