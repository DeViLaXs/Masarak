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
import { useLogin } from "@/hooks/useAuth";
import { LoginDto } from "@/services/authService";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [loginForm, setLoginForm] = useState<LoginDto>({
    Email: "",
    Password: "",
  });

  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(loginForm,{
      onSuccess:(res)=>{
        if(res.data.role === "Company"){
          router.push("/company");
        }
        else if(res.data.role === "Admin"){
          router.push("/admin");
        }
      }
    });
    if(login.isSuccess){
      console.log("success");
      
      // router.push("/company");
    }
    else if(login.isError){
      console.log(login.error);
      alert("Login failed");
    }
  };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">مرحباً بك مجدداً</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.Email}
                  onChange={(e) => setLoginForm({ ...loginForm, Email: e.target.value })}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
                </div>
                <Input id="password" type="password" value={loginForm.Password} onChange={(e) => setLoginForm({ ...loginForm, Password: e.target.value })} required />
                <Link
                  href="/forget-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  نسيت كلمة المرور
                </Link>
              </Field>
              <Field>
                  <Button type="submit" disabled={login.isPending} className="w-full">
                    تسجيل الدخول
                  </Button>
                
                <FieldDescription className="text-center">
                  ليس لديك حساب؟<Link href="/register">سجل الأن</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
