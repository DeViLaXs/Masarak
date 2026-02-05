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
    <div className="bg-card border-border rounded-2xl border p-8 text-center transition hover:shadow-md">
      <div
        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${color}`}
      >
        {icon}
      </div>

      <h3 className="text-foreground mb-2 text-lg font-bold">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  )
}
