import Link from 'next/link'

import { Button } from '~/app/_components/ui/button'

import { cn } from '~/app/_libs/utils'

export default function Page() {
  return (
    <div className={cn({ ddd: true })}>
      <Button>Button</Button>
      <Link href={'/admin/login'}>auth</Link>
    </div>
  )
}
