import { Card } from '../ui/Card'
import type { ProductVerification } from '../../types/verification'

type ProductDetailsProps = Pick<
  ProductVerification,
  | 'sku'
  | 'company'
  | 'serialNumber'
  | 'labelCode'
  | 'provinceCode'
  | 'certificationStandard'
  | 'issuedAt'
  | 'expiresAt'
>

const formatLabel = (label: string): string => label

export function ProductDetails(props: ProductDetailsProps) {
  const fields = [
    { label: 'SKU', value: props.sku },
    { label: 'Company', value: props.company },
    { label: 'Serial Number', value: props.serialNumber },
    { label: 'Label Code', value: props.labelCode },
    { label: 'Province Code', value: props.provinceCode },
    { label: 'Certification Standard', value: props.certificationStandard },
    { label: 'Issued Date', value: props.issuedAt },
    { label: 'Expiration Date', value: props.expiresAt },
  ]

  return (
    <Card title="Details du produit">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="rounded-lg bg-slate-50 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              {formatLabel(field.label)}
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">{field.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
