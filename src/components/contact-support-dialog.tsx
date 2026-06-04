'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useSubmitFeedback, useFeedbackTypes } from '@/hooks/use-feedback'
import { gooeyToast as toast } from "@/components/ui/goey-toaster"
import { Loader2, Headset } from 'lucide-react'

export function ContactSupportDialog({ size = 'default' }: { size?: 'default' | 'sm' | 'lg' | 'icon' }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  
  const { data: types } = useFeedbackTypes()
  const { mutateAsync: submitFeedback, isPending } = useSubmitFeedback()
  
  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error('الرجاء كتابة رسالة قبل الإرسال')
      return
    }

    if (message.trim().length < 10) {
      toast.error('يجب أن تحتوي الرسالة على 10 أحرف على الأقل')
      return
    }
    
    // Find Complaint type id
    const complaintType = types?.find(t => t.name === 'Complaint')
    if (!complaintType) {
      toast.error('لا يمكن إرسال الشكوى حالياً')
      return
    }

    try {
      await submitFeedback({
        feedbackType: complaintType.id,
        message: message.trim(),
      })
      toast.success('تم إرسال رسالتك بنجاح', {
        description: 'سيقوم فريق الدعم بمراجعة رسالتك في أقرب وقت',
      })
      setMessage('')
      setOpen(false)
    } catch (error) {
      toast.error('حدث خطأ أثناء إرسال الرسالة')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className="w-full px-8 sm:w-auto flex items-center justify-center gap-2 border-primary/20 text-primary hover:bg-primary/10"
        >
          <Headset className="h-5 w-5" />
          تواصل مع الدعم
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-['Cairo']" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">تواصل مع الدعم الفني</DialogTitle>
          <DialogDescription className="text-right">
            اكتب رسالتك أو شكواك هنا وسيقوم فريق الدعم الفني بمراجعتها والتواصل معك.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب تفاصيل الشكوى أو الملاحظة..."
            className="min-h-[120px] resize-none"
            dir="rtl"
          />
          <div className="flex justify-end px-1">
            <span className={`text-xs ${message.trim().length > 0 && message.trim().length < 10 ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
              {message.trim().length}/100
            </span>
          </div>
        </div>
        <DialogFooter className="sm:justify-start flex gap-2">
          <Button type="button" className='min-w-36' onClick={handleSubmit} disabled={isPending || message.trim().length < 10}>
            {isPending ? <Loader2 className="ml-2 size-4 animate-spin" /> : null}
            إرسال الشكوى
          </Button>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
