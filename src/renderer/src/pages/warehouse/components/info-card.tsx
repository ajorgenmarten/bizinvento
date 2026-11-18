import { Card, CardDescription, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { JSX } from 'react/jsx-runtime'

type InfoCardProps = {
  info: string
  value: string
}

export default function InfoCard(props: InfoCardProps): JSX.Element {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardDescription>{props.info}</CardDescription>
        <CardTitle className="text-2xl">{props.value}</CardTitle>
      </CardHeader>
    </Card>
  )
}
