import type { PropsWithChildren } from 'react'

type BadgeVariant = 'success' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-700',
  neutral: 'bg-slate-100 text-slate-700',
}

export function Badge({
  children,
  variant = 'neutral',
}: PropsWithChildren<BadgeProps>) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
