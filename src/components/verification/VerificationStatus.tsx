import { Badge } from '../ui/Badge'
import { FaCircleCheck } from 'react-icons/fa6'

interface VerificationStatusProps {
  title: string
  subtitle: string
}

export function VerificationStatus({ title, subtitle }: VerificationStatusProps) {
  return (
    <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
      <div className="mb-3 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
          <FaCircleCheck className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-semibold text-emerald-800">{title}</h1>
      </div>
      <p className="mb-3 text-sm text-emerald-700">{subtitle}</p>
      <Badge variant="success">Verification reussie</Badge>
    </section>
  )
}
