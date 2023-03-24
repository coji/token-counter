import type { ComponentProps } from 'react'
import { classNames } from '~/utils/class-names'

interface AppCardProps extends ComponentProps<'div'> {
  children: React.ReactNode
}
export const AppCard = ({ children, ...rest }: AppCardProps) => {
  return (
    <div className={classNames('card border', rest.className ?? '')} {...rest}>
      {children}
    </div>
  )
}
