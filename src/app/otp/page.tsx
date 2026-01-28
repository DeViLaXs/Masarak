import AuthNavBar from "@/components/AuthNavBar"
import { OTPForm } from "@/components/otp-form"

export default function OTPPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col w-full">
      <AuthNavBar />
      <div className="flex flex-col items-center gap-6 p-5 md:p-8">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <OTPForm />
        </div>
      </div>
    </div>
  )
}
