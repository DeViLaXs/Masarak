'use client'

import { Suspense } from 'react'
import { NewPassword } from '../_components/new-password'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPassword />
    </Suspense>
  )
}
