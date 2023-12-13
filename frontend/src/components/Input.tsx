import {EyeIcon, EyeSlashIcon} from "@heroicons/react/24/outline"
import clsx from "clsx"
import {SetStateAction, useId, useState} from "react"

interface BasicProperties {
  label: string
  invalid: boolean
  disabled?: boolean
  autoComplete?: string
  children?: React.ReactNode
}

interface InputProperties extends BasicProperties {
  type: string
  input: string | number | readonly string[] | undefined
  setInput: React.Dispatch<SetStateAction<string>>
}

function Input({
  label,
  disabled,
  invalid,
  autoComplete,
  input,
  setInput,
  type,
  children
}: InputProperties) {
  const id = useId()

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-neutral-950"
      >
        {label}
      </label>
      <div
        className={clsx("relative mt-2", disabled ? 'cursor-not-allowed' : '')}>
        <input
          className={clsx(
            "block w-full rounded-md border-0 py-1.5 text-neutral-950 shadow-sm ring-inset placeholder:text-neutral-700 focus:ring-inset sm:text-sm sm:leading-6",
            "disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:ring-neutral-200",
            invalid
              ? "ring-2 ring-inset ring-red-500 focus:ring-2 focus:ring-red-500"
              : "ring-1 ring-neutral-300 focus:ring-2 focus:ring-neutral-700"
          )}
          id={id}
          type={type}
          autoComplete={autoComplete}
          onChange={event => setInput(event.target.value)}
          value={input}
          disabled={disabled}
          required
        />
        {children}
      </div>
    </div>
  )
}

interface TextInputProperties extends BasicProperties {
  text: string
  setText: React.Dispatch<SetStateAction<string>>
}

export function TextInput({text, setText, ...properties}: TextInputProperties) {
  return (
    <Input input={text} setInput={setText} type="text" {...properties}/>
  )
}

interface PasswordInputProperties extends BasicProperties {
  show: boolean
  password: string
  setPassword: React.Dispatch<SetStateAction<string>>
}

export function PasswordInput(
  {show, password, setPassword, ...properties}: PasswordInputProperties
) {
  return (
    <Input
      input={password}
      setInput={setPassword}
      type={show ? "text" : "password"}
      {...properties}
    />
  )
}

export function PasswordToggle({show, setShow, disabled = false}: {
  show: boolean
  setShow: React.Dispatch<SetStateAction<boolean>>
  disabled?: boolean
}) {
  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
      <button
        type="button"
        className="disabled:cursor-not-allowed"
        onClick={event => {
          event.preventDefault()
          setShow(!show)
        }}
        disabled={disabled}
      >
        {(() => {
          return show
            ? <EyeSlashIcon className="h-5 w-5 text-neutral-950"/>
            : <EyeIcon className="h-5 w-5 text-neutral-950"/>
        })()}
      </button>
    </div>
  )
}

interface PasswordInputWithToggleProperties extends Omit<PasswordInputProperties, 'show'> {}

export function PasswordInputWithToggle(properties: PasswordInputWithToggleProperties) {
  const [show, setShow] = useState(false)

  return (
    <PasswordInput show={show} {...properties}>
      <PasswordToggle show={show} setShow={setShow} disabled={properties.disabled}/>
    </PasswordInput>
  )
}