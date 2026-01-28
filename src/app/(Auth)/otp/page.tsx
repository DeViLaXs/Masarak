import AuthNavBar from "@/app/(Auth)/_components/AuthNavBar";
import { OTPForm } from "@/app/(Auth)/_components/otp-form";

export default function OTPPage() {
  return (
    <div className="flex flex-col items-center gap-6 p-5 md:p-8">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <OTPForm />
      </div>
    </div>
  );
}
