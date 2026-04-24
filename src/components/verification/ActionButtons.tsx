import { Button } from '../ui/Button'
import { FaArrowRotateLeft, FaArrowUpRightFromSquare, FaFileCircleCheck } from 'react-icons/fa6'

interface ActionButtonsProps {
  merchantWebsite: string
}

export function ActionButtons({ merchantWebsite }: ActionButtonsProps) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Button variant="secondary">
        <span className="inline-flex items-center gap-2">
          <FaArrowRotateLeft className="h-3.5 w-3.5" />
          Scanner un autre produit
        </span>
      </Button>
      <Button variant="primary">
        <span className="inline-flex items-center gap-2">
          <FaFileCircleCheck className="h-3.5 w-3.5" />
          Voir le certificat
        </span>
      </Button>
      <a href={merchantWebsite} target="_blank" rel="noreferrer">
        <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
          <FaArrowUpRightFromSquare className="h-3.5 w-3.5" />
          Visiter le site marchand
        </span>
      </a>
    </section>
  )
}
