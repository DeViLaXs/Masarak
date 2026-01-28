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

export function ForgetPassword({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="mt-20">
        <CardHeader className="text-center">
          <CardTitle className="text-xl mb-5">نسيت كلمة المرور</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" onClick={() => router.push("/admin")}>
                  ارسال
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
