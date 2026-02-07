import { OTPForm } from '@/app/(Auth)/_components/otp-form'
import { Suspense } from 'react'

export default function OTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col items-center gap-6 p-5 max-sm:p-3 md:p-8">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <OTPForm />
        </div>
      </div>
    </Suspense>
  )
}
