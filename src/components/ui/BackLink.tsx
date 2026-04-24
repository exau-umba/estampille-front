import { FaArrowLeft } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

interface BackLinkProps {
  to: string
  label?: string
}

export function BackLink({ to, label = 'Retour à la liste' }: BackLinkProps) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline">
      <FaArrowLeft className="h-3.5 w-3.5" />
      {label}
    </Link>
  )
}
