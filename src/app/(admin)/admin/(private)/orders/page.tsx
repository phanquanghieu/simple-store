import { Button } from '~/app/_components/ui/button'

export default function Page() {
  return (
    <>
      <div className='flex items-center justify-between'>
        <h3 className='text-2xl font-semibold'>Orders</h3>
        <div>
          <Button>Create</Button>
        </div>
      </div>
    </>
  )
}
