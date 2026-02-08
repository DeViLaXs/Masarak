import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function CheckEmail() {
  return (
    <div className="mt-20 text-center">
      <p className="text-2xl font-bold">check your email</p>
      <p className="mt-5 text-gray-500">
        we sent a verification code to your email
      </p>
    </div>
  )
}
