import { JSX } from 'react/jsx-runtime'
import { Package } from 'lucide-react'
import { Link } from 'react-router'
import { cn } from '@renderer/lib/utils'

type BrandProps = {
  to?: string
  className?: string
}

export default function Brand({ to, className }: BrandProps): JSX.Element {
  const content = (
    <>
      <span className="grid size-8 place-items-center rounded-[10px] bg-foreground text-background transition-transform duration-200 group-hover:-rotate-3">
        <Package className="size-4" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight">BizInvento</span>
    </>
  )

  if (to) {
    return (
      <Link
        to={to}
        aria-label="Ir al panel principal"
        className={cn(
          'group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
          className
        )}
      >
        {content}
      </Link>
    )
  }

  return <div className={cn('flex items-center gap-2.5', className)}>{content}</div>
}
