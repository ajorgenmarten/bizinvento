import { JSX } from 'react/jsx-runtime'
import { type LucideIcon } from 'lucide-react'
import { PropsWithChildren } from 'react'
import AppHeader from './app-header'

type LayoutProps = {
  icon?: LucideIcon | null
  title: string
  description: string
  sideElement?: JSX.Element | null
} & PropsWithChildren

export default function Layout(props: LayoutProps): JSX.Element {
  const Icon = props.icon

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            {Icon && (
              <div className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl border border-border/70 bg-card text-foreground">
                <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">
                {props.title}
              </h1>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">{props.description}</p>
            </div>
          </div>
          {props.sideElement && (
            <div className="flex shrink-0 items-center gap-2">{props.sideElement}</div>
          )}
        </header>

        <div className="flex flex-col gap-6">{props.children}</div>
      </main>
    </div>
  )
}
