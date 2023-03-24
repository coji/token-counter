import type { ComponentProps } from 'react'

interface AppCardBodyProps extends ComponentProps<'div'> {
  children: React.ReactNode
}
export const AppCardBody = ({ children, ...rest }: AppCardBodyProps) => {
  return (
    <div className="card-body" {...rest}>
      {children}
    </div>
  )
}
