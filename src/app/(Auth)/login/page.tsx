import { LoginForm } from '@/app/(auth)/_components/login-form'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-6 p-5 md:p-8">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  )
}
