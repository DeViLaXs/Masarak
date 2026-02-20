'use client'

import React from 'react'
import { Monitor, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'

export function MobileRestriction() {
  return (
    <div className="bg-background fixed inset-0 z-100 flex flex-col items-center justify-center px-6 text-center md:hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center space-y-8"
      >
        {/* Visual Indicator */}
        <div className="relative">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="bg-primary/10 flex h-24 w-24 items-center justify-center rounded-3xl"
          >
            <Monitor className="text-primary size-12" />
          </motion.div>
          <motion.div
            className="border-background absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-xl border-4 bg-orange-500 text-white shadow-lg"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Smartphone size={20} />
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold tracking-tight">
            تجربة أفضل على الحاسب
          </h1>
          <p className="text-muted-foreground mx-auto max-w-xs leading-relaxed">
            لوحة تحكم مسارك مصممة لتوفر أفضل تجربة على شاشات الحاسوب الكبيرة.
            يرجى المتابعة من جهاز الكمبيوتر الخاص بك.
          </p>
        </div>

        {/* English Fallback */}
        <div className="pt-4 opacity-50">
          <p className="text-xs font-medium tracking-widest uppercase">
            Best Experienced on Desktop
          </p>
        </div>

        {/* Decorative elements */}
        <div className="flex gap-2 opacity-20">
          <div className="bg-primary h-1.5 w-12 rounded-full" />
          <div className="bg-primary h-1.5 w-4 rounded-full" />
        </div>
      </motion.div>
    </div>
  )
}
