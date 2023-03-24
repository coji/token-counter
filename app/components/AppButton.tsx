import type { ComponentProps } from 'react'
import { classNames } from '~/utils/class-names'

interface AppButtonProps extends ComponentProps<'button'> {
  children: React.ReactNode
  isLoading?: boolean
}
export const AppButton = ({ children, isLoading = false, ...rest }: AppButtonProps) => {
  const className = classNames('btn btn-primary', isLoading ? 'loading' : '', rest.className ?? '')
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  )
}
