import type { ComponentProps } from 'react'
import { classNames } from '~/utils/class-names'

interface AppInputProps extends ComponentProps<'select'> {
  name: string
  label?: string
  children: React.ReactNode
}
export const AppSelect = ({ name, label, className, children, ...rest }: AppInputProps) => {
  return (
    <div className={classNames('form-control block', className ?? '')}>
      {label && (
        <label className={classNames('label mr-2')} htmlFor={name}>
          <span className="label-text">{label}</span>
        </label>
      )}
      <select id={name} name={name} className={classNames('select select-bordered')} {...rest}>
        {children}
      </select>
    </div>
  )
}
