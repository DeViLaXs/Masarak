import { LoginForm } from '../_components/login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center p-5 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl mt-10 ">
        <LoginForm />
      </div>
    </div>
  )
}
