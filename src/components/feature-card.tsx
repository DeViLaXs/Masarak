interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  desc: string
  color: string
}

export default function FeatureCard({
  icon,
  title,
  desc,
  color,
}: FeatureCardProps) {
  return (
    <div className='bg-card rounded-2xl p-8 text-center hover:shadow-md transition border border-border'>
      <div
        className={`w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full ${color}`}>
        {icon}
      </div>

      <h3 className='font-bold text-lg mb-2 text-foreground'>{title}</h3>
      <p className='text-muted-foreground text-sm leading-relaxed'>{desc}</p>
    </div>
  )
}
