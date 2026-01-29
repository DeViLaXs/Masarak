import FeedbackCard from "@/app/(dashboard)/company/_component/HomeCard";

export default function FeedbacksPage() {
  return (
    <div className="p-6 max-sm:p-4">
      <h1 className="text-2xl max-sm:text-xl font-bold mb-6 max-sm:mb-4">
        إدارة التعليقات
      </h1>
      <FeedbackCard />
    </div>
  );
}
