'use client'

import { ChangeEvent, useEffect, useId, useRef } from "react"
import { useFormStatus } from "react-dom"
import classNames from "classnames"
import type { InputPropTypes } from "app/lib/definitions"

type Props = InputPropTypes<HTMLInputElement> & {
  type: 'text' | 'number' | 'email';
}
export default function Input({
  name,
  type,
  value,
  onChange,
  disabled,
  label,
  placeholder,
  className,
  maxLength,
}: Props) {
  const inputId = useId()
  const { pending } = useFormStatus()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // set initial value
    if (inputRef.current && value) {
      inputRef.current.value = value
    }
  }, [value])

  function _onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!disabled && !pending) {
      onChange && onChange(e)
    }
  }

  return (
    <div className={classNames(['border border-gray-var-2 px-4 py-3', className])}>
      <label htmlFor={inputId}>{label}</label>
      <input
        ref={inputRef}
        className="outline-none w-full"
        data-testid="input"
        type={type}
        name={name}
        id={inputId}
        disabled={disabled || pending}
        placeholder={placeholder}
        onChange={_onChange}
        maxLength={maxLength}
      />
    </div>
  )
}