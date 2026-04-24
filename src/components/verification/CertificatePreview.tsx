import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { FaFilePdf } from 'react-icons/fa6'

interface CertificatePreviewProps {
  fileName: string
}

export function CertificatePreview({ fileName }: CertificatePreviewProps) {
  return (
    <Card title="Certificat">
      <div className="mb-4 flex h-52 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        <div className="flex flex-col items-center gap-2">
          <FaFilePdf className="h-8 w-8 text-slate-400" />
          <span>Apercu PDF (mock) - {fileName}</span>
        </div>
      </div>
      <Button variant="secondary">Voir le certificat</Button>
    </Card>
  )
}
