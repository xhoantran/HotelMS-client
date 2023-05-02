import { Switch } from '@headlessui/react'
import clsx from 'clsx'

interface ToggleProps {
  value: boolean
  onChange: (value: boolean) => void
  title: string
  description?: string
}

export function Toggle({ value, onChange, title, description }: ToggleProps) {
  return (
    <Switch.Group as="div" className="flex items-center justify-between">
      <span className="flex grow flex-col">
        <Switch.Label
          as="span"
          className="text-sm font-medium leading-6 text-gray-900"
          passive
        >
          {title}
        </Switch.Label>
        <Switch.Description as="span" className="text-sm text-gray-500">
          {description}
        </Switch.Description>
      </span>
      <Switch
        checked={value}
        onChange={onChange}
        className={clsx(
          value ? 'bg-blue-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            value ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
    </Switch.Group>
  )
}
