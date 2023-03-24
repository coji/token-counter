import type { ComponentProps } from 'react'
import { classNames } from '~/utils/class-names'

interface AppCardTitleProps extends ComponentProps<'div'> {
  children: React.ReactNode
}
export const AppCardTitle = ({ children, ...rest }: AppCardTitleProps) => {
  return (
    <div className={classNames('card-title px-4 py-2 bg-red-50 rounded-t-box', rest.className ?? '')} {...rest}>
      {children}
    </div>
  )
}
