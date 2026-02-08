'use client'
import { Suspense } from 'react'
import { NewPassword } from '../_components/new-password'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col items-center gap-6 p-5 md:p-8">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <NewPassword />
        </div>
      </div>
    </Suspense>
  )
}
