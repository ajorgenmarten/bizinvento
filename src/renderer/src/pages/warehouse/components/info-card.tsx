import { Card, CardDescription, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { JSX } from 'react/jsx-runtime'
import type { LucideIcon } from 'lucide-react'

type InfoCardProps = {
  info: string
  value: string
  icon?: LucideIcon
}

export default function InfoCard(props: InfoCardProps): JSX.Element {
  const Icon = props.icon

  return (
    <Card size="sm" className="gap-4 bg-card/60">
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <CardDescription className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
            {props.info}
          </CardDescription>
          {Icon && (
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
              <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </span>
          )}
        </div>
        <CardTitle className="text-[26px] font-semibold leading-none tabular-nums tracking-tight">
          {props.value}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
