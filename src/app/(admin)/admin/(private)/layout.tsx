import ThemeToggle from '../_components/theme-toggle'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex min-h-screen'>
      <div className='w-96 bg-slate-300'>sidebar</div>
      <div className='w-full'>
        <div className='flex items-center justify-between p-4'>
          <h4>Header</h4>
          <div>
            <ThemeToggle />
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
