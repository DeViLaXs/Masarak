"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForgetPassword } from "@/hooks/useAuth";
import { useState } from "react";

export function ForgetPassword({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();


  const forgetPasswordMutation = useForgetPassword();

  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    forgetPasswordMutation.mutate({ Email: email },{
      onSuccess: () => {
        router.push("/check-email");
      },
      onError: (error) => {
       alert(error.message);
      },
    });
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="mt-20">
        <CardHeader className="text-center">
          <CardTitle className="text-xl mb-5">نسيت كلمة المرور</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={forgetPasswordMutation.isPending} >
                  {forgetPasswordMutation.isPending ? "جاري الارسال..." : "ارسال"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
