import { Button } from '~/app/_components/ui/button'

import { PageHeader } from '../../../_components/page-header'

export default async function Page() {
  return (
    <>
      <PageHeader title='Create Product' backUrl='/admin/products'>
        <Button>Save</Button>
        <Button>Save</Button>
      </PageHeader>
    </>
  )
}
