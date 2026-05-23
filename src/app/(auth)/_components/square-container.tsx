import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BubbleBackground } from '@/components/animate-ui/components/backgrounds/bubble'

export default function SquareContainer() {
    return (
         <BubbleBackground
           interactive
           colors={{
             first: '2,127,199',   // #027fc7
             second: '1,56,86',     // #013856
             third: '0,162,255',    // #00a2ff
             fourth: '0,208,255',   // #00d0ff
             fifth: '14,165,233',   // #0ea5e9
             sixth: '0,220,255',    // bright cyan
           }}
           className="hidden md:flex md:w-[45%] h-full flex-col justify-center items-center text-center p-12 text-white relative overflow-hidden bg-gradient-to-br from-[#027fc7] to-[#013856]"
         >
          


        {/* Content Container */}
        <div className="flex flex-col items-center max-w-sm z-10 gap-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
           
            className="flex flex-col items-center max-w-sm z-10 gap-2"
          >
            {/* Logo Text */}
            <div className="text-3xl font-black tracking-wide text-white mb-2 font-['Cairo']">
              Masarak | مسارك
            </div>

            <h2 className="text-2xl font-black text-white leading-tight mb-2 font-['Cairo']">
              خطوتك القادمة تبدأ من هنا
            </h2>

            <p className="text-sm font-semibold text-white/80 leading-relaxed max-w-xs mb-8 font-['Cairo']">
              انضم إلى آلاف الشركات التي تشكل مستقبلها من خلال منصة مسارك المتكاملة للتوظيف.
            </p>

            {/* Squares Container */}
            <div className="flex items-center justify-center gap-6 mt-2">
            {/* Left Square (Tilted) */}
            <div className="w-36 h-36 rounded-4xl border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-black/10 animate-rotate-float hover:scale-105 transition-all duration-300">
                <Image
                    src="/masarak-logo-light.png"
                    alt="Masarak Logo"
                    width={130}
                    height={130}
                    className="object-contain rounded-3xl block dark:hidden"
                    priority
                />

                <Image
                    src="/masarak-logo-dark.png"
                    alt="Masarak Logo"
                    width={130}
                    height={130}
                    className="object-contain rounded-3xl hidden dark:block"
                    priority
                />
            </div>

            {/* Right Square (Straight) */}
            <div className="w-36 h-36 rounded-4xl border p-2 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-black/10 transition-all duration-300 hover:scale-105 animate-float">
                <Image
                    src="/masarak-new-light.png"
                    alt="Masarak Logo"
                    width={130}
                    height={130}
                    className="object-contain bg-white dark:bg-card rounded-3xl p-1 block dark:hidden"
                    priority
                />

                <Image
                    src="/masarak-new-dark.png"
                    alt="Masarak Logo"
                    width={130}
                    height={130}
                    className="object-contain bg-white rounded-3xl dark:bg-card p-1 hidden dark:block"
                    priority
                />
            </div>
        </div>
          </motion.div>
        </div>

        {/* Footer / Copyright */}
        <div dir='ltr' className="absolute bottom-8 left-0 right-0 text-xs text-white/60 font-semibold z-10 font-['Cairo'] text-center">
          @Masarak. 2026
        </div>
      </BubbleBackground>
    )
}
