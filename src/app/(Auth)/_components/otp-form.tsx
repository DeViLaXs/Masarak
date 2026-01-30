'use client'
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { VerifyOtpDto } from "@/services/authService";
import { useVerifyOtp } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {

  const searchParams = useSearchParams();

  console.log(searchParams.get("email"));

  const router = useRouter();
  const [otp,setOtp] = useState<VerifyOtpDto>({
    Email:searchParams.get("email") || "",
    EmailConfirmationCode:"",
  })

  const verifyOtp = useVerifyOtp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtp.mutate(otp)
    if(verifyOtp.isSuccess){
      router.push("/company");
    }
    else{
      alert("Invalid OTP");
    }
    console.log(otp);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 text-primary text-xl font-bold items-center justify-center rounded-md mb-5">
                GoWork
              </div>
            </a>
            <h1 className="text-xl font-bold">رمز التحقق</h1>
            <FieldDescription>
              تم ارسال رمز التحقق الى بريدك الالكتروني
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              رمز التحقق
            </FieldLabel>
            <InputOTP
              value={otp.EmailConfirmationCode}
              onChange={(e) => setOtp({...otp,EmailConfirmationCode:e})}
              maxLength={6}
              id="otp"
              required
              containerClassName="gap-2 sm:gap-4 item-center justify-center"
            >
              <InputOTPGroup className="gap-1.5 sm:gap-2.5 *:data-[slot=input-otp-slot]:h-14 sm:*:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-10 sm:*:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-lg sm:*:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={5}  />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-1.5 sm:gap-2.5 *:data-[slot=input-otp-slot]:h-14 sm:*:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-10 sm:*:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-lg sm:*:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={2} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={0} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">
              لم تلقي رمز التحقق؟ <a href="/admin">أعد الارسال</a>
            </FieldDescription>
          </Field>
          <Field>
            <Button type="submit">تحقق</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
