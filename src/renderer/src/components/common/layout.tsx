import { Link } from 'react-router'
import { JSX } from 'react/jsx-runtime'
import { Button } from '../ui/button'
import { ArrowLeft } from 'lucide-react'
import { type ShoppingCart } from 'lucide-react'
import { PropsWithChildren } from 'react'

type IconType = typeof ShoppingCart

type LayoutProps = {
  icon?: IconType | null
  backButton: boolean
  title: string
  description: string
  sideElement?: JSX.Element | null
} & PropsWithChildren

export default function Layout(props: LayoutProps): JSX.Element {
  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8 dark:bg-black">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            {props.backButton && (
              <Button
                nativeButton={false}
                render={
                  <Link to="/">
                    <ArrowLeft data-icon="inline-start" className="dark:text-white/90" />
                  </Link>
                }
                variant="ghost"
                size="icon"
                aria-label="Volver al panel principal"
              ></Button>
            )}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                {props.icon && <props.icon data-icon="inline-start" />}
                <span className="text-xs font-medium uppercase tracking-[0.18em]">Módulo</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight dark:text-white">
                {props.title}
              </h1>
              <p className="text-sm text-muted-foreground">{props.description}</p>
            </div>
          </div>
          {props.sideElement && props.sideElement}
        </header>

        {props.children}
      </div>
    </main>
  )
}
