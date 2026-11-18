import { JSX } from 'react/jsx-runtime'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router'

type MenuItemProps = {
  label: string
  description: string
  href: string
  icon: LucideIcon
}

export default function MenuItem(props: MenuItemProps): JSX.Element {
  return (
    <Link
      to={props.href}
      className="group flex aspect-square flex-col justify-between rounded-lg border border-border bg-card p-6 text-card-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <props.icon className="h-7 w-7 text-muted-foreground transition-colors group-hover:text-foreground" />
      <div className="flex flex-col gap-1">
        <span className="text-lg font-medium tracking-tight">{props.label}</span>
        <span className="text-sm text-muted-foreground">{props.description}</span>
      </div>
    </Link>
  )
}
