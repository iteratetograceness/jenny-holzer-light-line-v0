'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ErrorPage() {
  const router = useRouter()

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-10'>
      <h1 className='text-4xl font-bold'>SOMETHING IS VERY, VERY WRONG.</h1>
      <p>
        <Button className='rounded-full' onClick={() => router.refresh()}>
          Refresh
        </Button>
      </p>
    </div>
  )
}
