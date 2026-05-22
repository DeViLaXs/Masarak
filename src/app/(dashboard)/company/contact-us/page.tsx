import React from 'react'
import ContactUsClient from './_components/contact-us-client'

export const metadata = {
  title: 'تواصل معنا | مسارك',
  description: 'تواصل مع فريق مسارك لإرسال اقتراحاتك أو شكاواك',
}

export default function ContactUsPage() {
  return (
    <div className="w-full py-5">
      <ContactUsClient />
    </div>
  )
}
