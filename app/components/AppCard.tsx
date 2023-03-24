import type { ComponentProps } from 'react'

interface AppCardProps extends ComponentProps<'div'> {
  children: React.ReactNode
}
export const AppCard = ({ children, ...rest }: AppCardProps) => {
  return (
    <div className="card border-gray-100 border p-4" {...rest}>
      {children}
    </div>
  )
}
