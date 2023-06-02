import clsx from 'clsx'
import { formatNumber } from 'utils/format'

export const FactorBadge = ({
  percentage,
  increment,
  currency
}: {
  percentage: number
  increment: number
  currency: string
}) => {
  const className =
    percentage > 0 || increment > 0
      ? 'bg-green-50 text-green-700 ring-green-600/20'
      : percentage < 0 || increment < 0
      ? 'bg-red-50 text-red-700 ring-red-600/10'
      : 'bg-yellow-50 text-yellow-700 ring-yellow-600/10'
  const sign = percentage > 0 || increment > 0 ? '+' : ''
  // TODO: We prioritize percentage over increment, but we should have a parameter to choose
  const activeFactor =
    increment === 0 ? `${percentage}%` : `${formatNumber(increment)}${currency}`

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
        className
      )}
    >
      {sign}
      {activeFactor}
    </span>
  )
}
