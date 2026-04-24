import { Card } from './Card'

interface StatCardProps {
  label: string
  value: string
  trend: string
}

export function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <Card className="space-y-2">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      <p className="text-sm font-medium text-emerald-600">{trend}</p>
    </Card>
  )
}
