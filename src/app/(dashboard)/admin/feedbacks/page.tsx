import FeedbackCard from '@/app/(dashboard)/company/_components/home-card'

export default function FeedbacksPage() {
  return (
    <div className="p-6 max-sm:p-4">
      <h1 className="mb-6 text-2xl font-bold max-sm:mb-4 max-sm:text-xl">
        إدارة التعليقات
      </h1>
      <FeedbackCard />
    </div>
  )
}
