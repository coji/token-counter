import type { ComponentProps } from 'react'
import { classNames } from '~/utils/class-names'

interface AppCardTitleProps extends ComponentProps<'div'> {
  children: React.ReactNode
}
export const AppCardTitle = ({ children, className, ...rest }: AppCardTitleProps) => {
  return (
    <div
      {...rest}
      className={classNames('card-title px-4 py-2 bg-slate-100 text-slate-600 rounded-t-box', className ?? '')}
    >
      {children}
    </div>
  )
}
