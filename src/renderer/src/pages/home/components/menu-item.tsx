import { JSX } from 'react/jsx-runtime'
import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'

type MenuItemProps = {
  label: string
  description: string
  href: string
  icon: LucideIcon
  index: string
}

export default function MenuItem(props: MenuItemProps): JSX.Element {
  const Icon = props.icon

  return (
    <Link
      to={props.href}
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border/70 bg-card/50 p-5 text-card-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/15 hover:bg-card hover:shadow-[0_24px_60px_-40px_oklch(0_0_0/0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-brand-soft opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-foreground transition-colors duration-300 group-hover:bg-brand-soft group-hover:text-brand">
        <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[15px] font-medium tracking-tight">{props.label}</span>
        <span className="truncate text-[13px] text-muted-foreground">{props.description}</span>
      </span>
      <span className="flex items-center gap-3">
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground/50">
          {props.index}
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
        />
      </span>
    </Link>
  )
}
