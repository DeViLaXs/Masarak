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

import { useState } from "react";
import { RegisterDto } from "@/services/authService";
import { useRegister } from "@/hooks/useAuth";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const register = useRegister();

  const [registerForm, setRegisterForm] = useState<RegisterDto>({
    CompanyName: "",
    Email: "",
    Password: "",
    PasswordConfirmation: "",
    PhoneNumber: "",
    Industry: "",
    LogoUrl: null,
  });

  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(registerForm, {
      onSuccess: () => {
        router.push(`/otp?email=${encodeURIComponent(registerForm.Email)}`);
        console.log("Registration successful");
      },
      onError: (error) => {
        console.error("Registration failed:", error);
        alert("Registration failed");
      },
    });
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
                    setRegisterForm({
                      ...registerForm,
                      CompanyName: e.target.value,
                    })
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
                    setRegisterForm({ ...registerForm, Email: e.target.value })
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
                    setRegisterForm({
                      ...registerForm,
                      PhoneNumber: e.target.value,
                    })
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
                        setRegisterForm({
                          ...registerForm,
                          Password: e.target.value,
                        })
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
                        setRegisterForm({
                          ...registerForm,
                          PasswordConfirmation: e.target.value,
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
                      setRegisterForm({
                        ...registerForm,
                        Industry: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="logo">شعار الشركة</FieldLabel>
                  <Input
                    id="logo"
                    type="file"
                    required
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        LogoUrl: e.target.files?.[0] || null,
                      })
                    }
                  />
                </Field>
              </Field>
              <Field>
                <Button type="submit" disabled={register.isPending}>
                  تسجيل
                </Button>
                <FieldDescription className="text-center">
                  لديك حساب بالفعل؟ <Link href="/login">تسجيل الدخول</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
