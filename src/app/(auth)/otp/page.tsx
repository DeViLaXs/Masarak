import { Suspense } from 'react'
import { OTPForm } from '../_components/otp-form'

export default function OTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OTPForm />
    </Suspense>
  )
}
