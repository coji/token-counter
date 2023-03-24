import type { ComponentProps } from 'react'

interface AppCardTitleProps extends ComponentProps<'div'> {
  children: React.ReactNode
}
export const AppCardTitle = ({ children, ...rest }: AppCardTitleProps) => {
  return (
    <div className="card-title" {...rest}>
      {children}
    </div>
  )
}
