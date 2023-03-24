import type { ComponentProps } from 'react'
import { classNames } from '~/utils/class-names'

interface AppCardBodyProps extends ComponentProps<'div'> {
  children: React.ReactNode
}
export const AppCardBody = ({ children, ...rest }: AppCardBodyProps) => {
  const className = classNames('card-body', rest.className ?? '')
  console.log({
    component: 'card-body',
    className,
  })
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  )
}
