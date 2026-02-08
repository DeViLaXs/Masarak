import { SignupForm } from '../_components/signup-form'

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center gap-6 p-5 md:p-8">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignupForm />
      </div>
    </div>
  )
}
