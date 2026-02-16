import Link from 'next/link'
import Image from 'next/image'

export default function Logo() {
  return (
    <div className="flex h-10 items-center justify-center">
      <Link href="/" className="flex h-10 items-center justify-center">
        <Image
          src="/masarak-dark.png"
          className="hidden dark:block"
          alt="Logo"
          width={110}
          height={110}
        />
        <Image
          src="/masarak-light.png"
          className="block dark:hidden"
          alt="Logo"
          width={110}
          height={110}
        />
        <Image
          src="/Masarak-logo-dark.png"
          className="block dark:hidden"
          alt="Logo"
          width={25}
          height={25}
        />
        <Image
          src="/Masarak-logo.png"
          className="hidden dark:block"
          alt="Logo"
          width={25}
          height={25}
        />
      </Link>
    </div>
  )
}
