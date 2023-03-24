import type { ComponentProps } from 'react'
import { classNames } from '~/utils/class-names'

interface AppCardBodyProps extends ComponentProps<'div'> {
  children: React.ReactNode
}
export const AppCardBody = ({ children, className, ...rest }: AppCardBodyProps) => {
  return (
    <div
      {...rest}
      className={classNames('card-body px-4 py-2 max-h-80 bg-slate-800 text-slate-200 rounded-b-box', className ?? '')}
    >
      {children}
    </div>
  )
}
