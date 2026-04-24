import type { HTMLAttributes, PropsWithChildren } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
}

export function Card({ title, children, className = '', ...props }: PropsWithChildren<CardProps>) {
  return (
    <section
      className={`rounded-[var(--radius-card)] border border-slate-200 bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ${className}`}
      {...props}
    >
      {title ? <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2> : null}
      {children}
    </section>
  )
}
