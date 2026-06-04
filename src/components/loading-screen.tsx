import Logo from './logo'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

interface LoadingScreenProps {
  message?: string
  fullScreen?: boolean
}

export default function LoadingScreen({ message, fullScreen = true }: LoadingScreenProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-6 bg-background dark:bg-background font-['Cairo'] ${fullScreen ? 'fixed inset-0 z-50 h-screen w-screen' : 'w-full min-h-[400px] py-12 rounded-2xl border border-border/50 bg-card/50'}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse">
          
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
            {/* <Image
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
                  /> */}
          
        </div>
        {/* <Loader2 className="h-8 w-8 animate-spin text-primary" /> */}
      </div>
      {message && (
        <p className="text-muted-foreground animate-pulse text-sm font-medium">
          {message}
        </p>
      )}
    </div>
  )
}
