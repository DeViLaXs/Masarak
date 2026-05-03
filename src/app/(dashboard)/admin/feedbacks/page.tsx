import React from 'react'
import FeedbacksClient from './_components/feedbacks-client'

export const metadata = {
  title: 'إدارة الملاحظات | مسارك',
  description: 'استعراض وإدارة ملاحظات واقتراحات الشركات',
}

export default function FeedbacksPage() {
  return (
    <div className="w-full">
      <FeedbacksClient />
    </div>
  )
}
