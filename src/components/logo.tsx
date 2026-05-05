import Link from 'next/link'
import Image from 'next/image'

export default function Logo() {
  return (
    <div className="flex h-10 items-center justify-center">
      <Link href="/" className="flex h-10 items-center justify-center">
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
        <Image
          src="/masaraknew.png"
          className="hidden dark:block mr-5"
          alt="Logo"
          width={50}
          height={50}
        />
        <Image
          src="/masaraknew.png"
          className="block dark:hidden mr-1"
          alt="Logo"
          width={50}
          height={50}
        />
      </Link>
    </div>
  )
}
