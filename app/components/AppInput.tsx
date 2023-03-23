import type { ComponentProps } from 'react'
import { classNames } from '~/utils/class-names'

interface AppInputProps extends Omit<ComponentProps<'input'>, 'size'> {
  name: string
  label?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  direction?: 'vertical' | 'horizontal'
  className?: string
}
export const AppInput = ({
  name,
  label,
  size = 'md',
  className = '',
  direction = 'vertical',
  ...rest
}: AppInputProps) => {
  return (
    <div className={classNames(className, 'form-control block')}>
      {label && (
        <label className={classNames(direction === 'vertical' ? 'block' : 'inline-block', 'label mr-2')} htmlFor={name}>
          <span className="label-text">{label}</span>
        </label>
      )}
      <input
        id={name}
        name={name}
        className={classNames(
          direction === 'vertical' ? 'block w-full' : 'inline-block',
          'input input-bordered',
          `input-${size}`,
        )}
        {...rest}
      ></input>
    </div>
  )
}
