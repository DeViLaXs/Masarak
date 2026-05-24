import Link from 'next/link'
import Image from 'next/image'

export default function Logo() {
  return (
    
      <Link href="/" className="flex h-10 items-center group-data-[state=collapsed]:justify-center">
        <Image
          src="/masarak-logo-light.png"
          className="block dark:hidden"
          alt="Logo"
          width={40}
          height={40}
        />
        <Image
          src="/masarak-logo-dark.png"
          className="hidden dark:block"
          alt="Logo"
          width={40}
          height={40}
        />
        <Image
          src="/masarak-new-dark.png"
          className="hidden dark:block group-data-[state=collapsed]:hidden"
          alt="Logo"
          width={100}
          height={100}
        />
        <Image
          src="/masarak-new-light.png"
          className="block dark:hidden group-data-[state=collapsed]:hidden"
          alt="Logo"
          width={100}
          height={100}
        />
      </Link>
    
  )
}
