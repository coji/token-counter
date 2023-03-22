import type { ComponentProps } from 'react'
import { useField } from 'remix-validated-form'
import { classNames } from '~/utils/class-names'

interface AppInputProps extends Omit<ComponentProps<'input'>, 'size'> {
  name: string
  label?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}
export const AppInput = ({
  name,
  label,
  size = 'md',
  className = '',
  ...rest
}: AppInputProps) => {
  const { error, getInputProps } = useField(name)
  return (
    <div className={classNames(className, 'form-control')}>
      {label && (
        <label className="label" htmlFor={name}>
          <span className="label-text">{label}</span>
        </label>
      )}
      <input
        {...getInputProps({ id: name })}
        className={`input input-bordered w-full input-${size}`}
        {...rest}
      ></input>
    </div>
  )
}
