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

export function NewPassword({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl mb-7">إعادة تعيين كلمة المرور</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">ادخل كلمة المرور الجديدة</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">ادخل كلمة المرور الجديدة مرة أخرى</FieldLabel>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit" onClick={() => router.push("/login")}>
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
