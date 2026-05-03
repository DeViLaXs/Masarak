'use client'

import * as React from 'react'
import { useSubmitFeedback } from '@/hooks/use-feedback'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { toast } from 'sonner'
import {
  LightbulbIcon,
  AlertCircleIcon,
  SendIcon,
  MessageSquareIcon,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

export default function ContactUsClient() {
  const { mutateAsync: submitFeedback, isPending } = useSubmitFeedback()
  
  const [feedbackType, setFeedbackType] = React.useState<number | null>(null)
  const [message, setMessage] = React.useState('')
  const [isSuccess, setIsSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!feedbackType) {
      toast.error('يرجى اختيار نوع الرسالة أولاً')
      return
    }

    if (message.length < 10) {
      toast.error('الرسالة قصيرة جداً (الحد الأدنى 10 أحرف)')
      return
    }

    if (message.length > 300) {
      toast.error('الرسالة طويلة جداً (الحد الأقصى 300 حرف)')
      return
    }

    try {
      await submitFeedback({ feedbackType, message })
      setIsSuccess(true)
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً')
    }
  }

  if (isSuccess) {
    return (
      <div className="animate-in fade-in zoom-in-95 mx-auto flex w-full max-w-2xl flex-col items-center justify-center space-y-6 py-20 duration-500">
        <div className="flex size-24 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle2 className="size-12" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight">شكراً لتواصلك معنا!</h2>
          <p className="text-muted-foreground max-w-md text-lg">
            لقد استلمنا رسالتك بنجاح. نحن نقدر وقتك وملاحظاتك التي تساعدنا على تحسين منصة مسارك باستمرار.
          </p>
        </div>
        <Button 
          size="lg" 
          className="mt-6"
          onClick={() => {
            setIsSuccess(false)
            setMessage('')
            setFeedbackType(null)
          }}
        >
          إرسال رسالة أخرى
        </Button>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto w-full max-w-3xl space-y-8 pb-10 duration-500">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-l from-primary/10 via-background to-background p-8 text-right shadow-sm dark:from-primary/5">
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 backdrop-blur-md">
              <MessageSquareIcon className="size-6" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              تواصل معنا
            </h1>
          </div>
          <p className="mr-[68px] max-w-2xl text-base leading-relaxed text-muted-foreground">
            نحن هنا لنسمعك! شاركنا أفكارك، مقترحاتك لتطوير المنصة، أو أبلغنا عن أي مشكلة واجهتك أثناء استخدام مسارك.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-10 size-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-8">
              {/* Type Selection */}
              <div className="space-y-4">
                <FieldLabel className="text-lg">ما هو نوع رسالتك؟</FieldLabel>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Feature Request */}
                  <label
                    className={cn(
                      "relative flex cursor-pointer flex-col gap-4 rounded-xl border-2 p-5 transition-all",
                      feedbackType === 1
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                    )}
                  >
                    <input
                      type="radio"
                      name="feedbackType"
                      className="sr-only"
                      checked={feedbackType === 1}
                      onChange={() => setFeedbackType(1)}
                    />
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex size-10 items-center justify-center rounded-full transition-colors",
                        feedbackType === 1 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        <LightbulbIcon className="size-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">اقتراح ميزة</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          لديك فكرة رائعة لتطوير المنصة؟
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Complaint */}
                  <label
                    className={cn(
                      "relative flex cursor-pointer flex-col gap-4 rounded-xl border-2 p-5 transition-all",
                      feedbackType === 2
                        ? "border-destructive bg-destructive/5 shadow-sm"
                        : "border-border hover:border-destructive/50 hover:bg-accent/50"
                    )}
                  >
                    <input
                      type="radio"
                      name="feedbackType"
                      className="sr-only"
                      checked={feedbackType === 2}
                      onChange={() => setFeedbackType(2)}
                    />
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex size-10 items-center justify-center rounded-full transition-colors",
                        feedbackType === 2 
                          ? "bg-destructive text-destructive-foreground" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        <AlertCircleIcon className="size-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">شكوى / مشكلة</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          واجهت مشكلة أو خلل فني؟
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Message Input */}
              <Field className="space-y-3">
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="message" className="text-lg">تفاصيل الرسالة</FieldLabel>
                  <span className={cn(
                    "text-xs font-medium",
                    message.length < 10 || message.length > 300 ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {message.length} / 300
                  </span>
                </div>
                <Textarea
                  id="message"
                  className={cn(
                    "min-h-[160px] resize-y bg-background text-base transition-shadow focus-visible:ring-primary/20",
                    feedbackType === 2 && "focus-visible:ring-destructive/20"
                  )}
                  placeholder={
                    feedbackType === 1
                      ? "اشرح لنا فكرتك بالتفصيل وكيف ستساعدك في عملك..."
                      : feedbackType === 2
                      ? "صف لنا المشكلة التي واجهتك بالتفصيل لكي نتمكن من حلها..."
                      : "يرجى اختيار نوع الرسالة أولاً..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!feedbackType || isPending}
                />
                <FieldDescription className="text-xs">
                  يجب أن تكون الرسالة بين 10 و 300 حرف.
                </FieldDescription>
              </Field>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isPending || !feedbackType || message.length < 10 || message.length > 300}
                  className={cn(
                    "w-full h-12 text-base font-bold shadow-sm transition-all",
                    feedbackType === 2 
                      ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
                      : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  )}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <SendIcon className="mr-2 size-5 rtl:ml-2 rtl:mr-0" />
                      إرسال الرسالة
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
