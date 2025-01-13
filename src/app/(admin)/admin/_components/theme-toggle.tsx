'use client'

import { useTheme } from 'next-themes'
import { LuMoon, LuSun } from 'react-icons/lu'

import { Button } from '~/app/_components/ui/button'

export default function ThemeToggle({
  hideBorder = false,
}: {
  hideBorder?: boolean
}) {
  const { theme, setTheme } = useTheme()

  const handleChangeTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return (
    <Button
      onClick={handleChangeTheme}
      size='icon'
      variant={hideBorder ? 'ghost' : 'outline'}
    >
      <LuSun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <LuMoon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
    </Button>
  )
}
