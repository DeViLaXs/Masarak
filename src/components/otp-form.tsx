import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
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
              maxLength={6}
              id="otp"
              required
              containerClassName="gap-4"
            >
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={5} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
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
  )
}
