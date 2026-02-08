import React from 'react'
import { ForgetPassword } from '../_components/forget-password'

export default function ForgetPasswordPage() {
  return (
    <div className="flex flex-col items-center gap-6 p-5 md:p-8">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <ForgetPassword />
      </div>
    </div>
  )
}
