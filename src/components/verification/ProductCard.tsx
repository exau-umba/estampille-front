import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { FaCircleCheck } from 'react-icons/fa6'

interface ProductCardProps {
  name: string
  imageUrl: string
}

export function ProductCard({ name, imageUrl }: ProductCardProps) {
  return (
    <Card className="overflow-hidden p-0">
      <img src={imageUrl} alt={name} className="h-52 w-full object-cover" />
      <div className="space-y-3 p-5">
        <h2 className="text-lg font-semibold text-slate-900">{name}</h2>
        <Badge variant="success">
          <span className="inline-flex items-center gap-1">
            <FaCircleCheck className="h-3 w-3" />
            Authentique
          </span>
        </Badge>
      </div>
    </Card>
  )
}
