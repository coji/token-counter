import type { ComponentProps } from 'react'
import { classNames } from '~/utils/class-names'

interface AppCardProps extends ComponentProps<'div'> {
  children: React.ReactNode
}
export const AppCard = ({ children, className, ...rest }: AppCardProps) => {
  return (
    <div className={classNames('card border', className ?? '')} {...rest}>
      {children}
    </div>
  )
}
