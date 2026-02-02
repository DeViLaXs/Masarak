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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useResetPassword } from "@/hooks/useAuth";

export function NewPassword({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const email = useSearchParams().get("email");
  const token = useSearchParams().get("token");
  console.log(token);

  const resetPasswordMutation = useResetPassword();

  useEffect(() => {
    if (!token || !email) {
      router.replace("/login");
    }
  }, [token, email]);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(password !== confirmPassword){
    alert("كلمة المرور غير متطابقة");
  }
    resetPasswordMutation.mutate({ Email: email, NewPassword: password, Token: token },{
      onSuccess: () => {
        router.push("/login");
      },
      onError: (error) => {
       alert(error.message);
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl mb-7">إعادة تعيين كلمة المرور</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">ادخل كلمة المرور الجديدة</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">ادخل كلمة المرور الجديدة مرة أخرى</FieldLabel>
                </div>
                <Input id="password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
              </Field>
              <Field>
                <Button type="submit" >
                  تأكيد
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
