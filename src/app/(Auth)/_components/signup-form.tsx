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
import { useAuth } from "@/auth/AuthContext";
import { useState } from "react";
import type { User } from "@/auth/types";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { login } = useAuth();
  const [userData, setUserData] = useState<User>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    industry: "",
    role: "Company",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(userData);
    login(userData);
    // Navigate to OTP
    router.push("/otp");
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">إنشاء حساب جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">اسم الشركة</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  required
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  required
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">رقم الهاتف</FieldLabel>
                <Input
                  id="phone"
                  type="text"
                  required
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      required
                      onChange={(e) =>
                        setUserData({ ...userData, password: e.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      تأكيد كلمة المرور
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </Field>
                </Field>
                <Field>
                  <FieldLabel htmlFor="industry">الصناعة</FieldLabel>
                  <Input
                    id="industry"
                    type="text"
                    required
                    onChange={(e) =>
                      setUserData({ ...userData, industry: e.target.value })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="industry">Role</FieldLabel>
                  <select
                    value={userData.role}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        role: e.target.value as "Admin" | "Company",
                      })
                    }
                    className="w-full rounded border p-2"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Company">Company</option>
                  </select>
                </Field>
                <FieldDescription>
                  يجب أن يكون على الأقل 8 أحرف.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit">تسجيل</Button>
                <FieldDescription className="text-center">
                  لديك حساب بالفعل؟ <Link href="/login">تسجيل الدخول</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        بالضغط على التسجيل، أنت توافق على <a href="#">شروط الخدمة</a> و{" "}
        <a href="#">سياسة الخصوصية</a>.
      </FieldDescription>
    </div>
  );
}
