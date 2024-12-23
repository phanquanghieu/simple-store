import Link from 'next/link'

import { Button } from '~/app/_components/ui/button'

export default function Page() {
  return (
    <div className='flex h-full flex-col items-center justify-center'>
      <Button>Button</Button>
      <Link href={'/admin/login'}>auth</Link>
    </div>
  )
}
