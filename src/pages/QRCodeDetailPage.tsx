import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import QRCode from 'qrcode'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Pagination } from '../components/ui/Pagination'
import { qrBatchesMock } from '../data/dashboardMock'

export function QRCodeDetailPage() {
  const { id } = useParams()
  const [openDelete, setOpenDelete] = useState(false)
  const [page, setPage] = useState(1)
  const batch = qrBatchesMock.find((item) => item.id === id)
  const qrImages = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => {
        const sequence = index + 1
        const randomCode = generateAlphaNumeric4(`${id}-${sequence}`)
        return {
          id: `${id}-${sequence}`,
          sequence,
          randomCode,
        }
      }),
    [id],
  )
  const perPage = 8
  const totalPages = Math.ceil(qrImages.length / perPage)
  const paginated = qrImages.slice((page - 1) * perPage, page * perPage)

  async function downloadQrPng(qr: { randomCode: string }) {
    const data = `ETQ-${qr.randomCode}`
    const dataUrl = await QRCode.toDataURL(data, { margin: 1, width: 220 })
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 380
    const context = canvas.getContext('2d')
    if (!context) return

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = '#0f172a'
    context.font = '700 26px "Instrument Sans", sans-serif'
    context.textAlign = 'center'
    context.fillText('OCC/NCD', canvas.width / 2, 42)

    const qrImage = new Image()
    qrImage.src = dataUrl
    await new Promise((resolve) => {
      qrImage.onload = resolve
    })
    context.drawImage(qrImage, 40, 70, 220, 220)

    context.fillStyle = '#334155'
    context.font = '600 13px "Instrument Sans", sans-serif'
    context.fillText('ID ETIQUETTE', canvas.width / 2, 330)
    context.fillStyle = '#0f172a'
    context.font = '700 16px "Instrument Sans", sans-serif'
    context.fillText(qr.randomCode, canvas.width / 2, 352)

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `ETQ-${qr.randomCode}.png`
    link.click()
  }

  async function exportQrSvg(qr: { randomCode: string }) {
    const data = `ETQ-${qr.randomCode}`
    const dataUrl = await QRCode.toDataURL(data, { margin: 0, width: 220 })
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="280" height="360" viewBox="0 0 280 360">
  <rect width="100%" height="100%" fill="#ffffff" />
  <text x="140" y="45" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="20" font-weight="700" fill="#0f172a">OCC/NCD</text>
  <image href="${dataUrl}" x="30" y="60" width="220" height="220" />
  <!-- <text x="140" y="310" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="12" font-weight="600" fill="#334155">ID ETIQUETTE</text> -->
  <text x="140" y="300" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="14" font-weight="700" fill="#0f172a">${qr.randomCode}</text>
</svg>`.trim()

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const blobUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = `ETQ-${qr.randomCode}.svg`
    link.click()
    URL.revokeObjectURL(blobUrl)
  }

  if (!batch) return <p className="text-sm text-slate-600">Lot QR introuvable.</p>

  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <Link to="/admin/qr-codes" className="text-sm font-semibold text-brand-700 hover:underline">
            &larr; Retour à la liste
          </Link>
          <h1 className="text-4xl font-bold text-slate-900">Détail lot QR</h1>
          <p className="text-slate-600">{batch.id}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/qr-codes/add"><Button variant="secondary">Régénérer</Button></Link>
          <Button type="button" onClick={() => setOpenDelete(true)}>Supprimer</Button>
        </div>
      </header>
      <article className="rounded-2xl border border-slate-200 bg-white p-6">
        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div><dt className="text-xs uppercase text-slate-500">ID Lot</dt><dd>{batch.id}</dd></div>
          <div><dt className="text-xs uppercase text-slate-500">Créé le</dt><dd>{batch.createdAt}</dd></div>
          <div><dt className="text-xs uppercase text-slate-500">Produit</dt><dd>{batch.productName}</dd></div>
          <div><dt className="text-xs uppercase text-slate-500">Quantité générée</dt><dd>{batch.generated}</dd></div>
        </dl>
      </article>
      <article className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Images QR du lot (paginé)</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {paginated.map((qr) => (
            <div key={qr.id} className="rounded-lg border border-slate-200 p-3">
              <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">OCC/NCD</p>
              <div className="mx-auto h-28 w-28 rounded-md border border-slate-200 bg-white">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`ETQ-${qr.randomCode}`)}`}
                  alt={qr.id}
                  className="h-full w-full object-contain"
                />
              </div>
              {/* <p className="mt-2 text-center text-[11px] text-slate-500">N° séquentiel affiché</p> */}
              <p className="text-center text-xs font-semibold text-slate-700">{String(qr.sequence).padStart(4, '0')}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => void downloadQrPng(qr)}
                  className="inline-flex items-center justify-center rounded-md border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Télécharger
                </button>
                <button
                  type="button"
                  onClick={() => void exportQrSvg(qr)}
                  className="inline-flex cursor-pointer items-center justify-center rounded-md bg-brand-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
                >
                  Exporter
                </button>
              </div>
            </div>
          ))}
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </article>
      <ConfirmDialog
        isOpen={openDelete}
        title="Confirmer la suppression"
        message="Voulez-vous supprimer ce lot QR ?"
        onCancel={() => setOpenDelete(false)}
        onConfirm={() => setOpenDelete(false)}
        confirmLabel="Supprimer"
      />
    </section>
  )
}

function generateAlphaNumeric4(seed: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  let output = ''
  for (let i = 0; i < 4; i += 1) {
    output += chars[(hash + i * 13) % chars.length]
    hash = (hash * 33 + 17) >>> 0
  }
  return output
}
