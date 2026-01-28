import AuthNavBar from "@/components/AuthNavBar";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col w-full">
      <AuthNavBar />
      <div className="flex flex-col items-center gap-6 p-5 md:p-8">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
