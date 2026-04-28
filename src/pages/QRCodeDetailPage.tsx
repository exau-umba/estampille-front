import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import QRCode from 'qrcode'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { CenteredLoading } from '../components/ui/CenteredLoading'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Pagination } from '../components/ui/Pagination'
import { adminCrudService, type BatchCodeDto, type BatchDto } from '../services/adminCrudService'

export function QRCodeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [openDelete, setOpenDelete] = useState(false)
  const [page, setPage] = useState(1)
  const [batch, setBatch] = useState<BatchDto | null>(null)
  const [qrImages, setQrImages] = useState<BatchCodeDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [form, setForm] = useState({
    product_name: '',
    quantity: 0,
    status: 'pending',
  })
  const perPage = 8

  useEffect(() => {
    async function loadBatchDetail() {
      if (!id) return
      setIsLoading(true)
      try {
        const [batchResult, codesResult] = await Promise.all([
          adminCrudService.getBatch(id),
          adminCrudService.listBatchCodes(id, page, perPage),
        ])
        setBatch(batchResult.data)
        setForm({
          product_name: batchResult.data.product_name ?? '',
          quantity: batchResult.data.quantity ?? 0,
          status: batchResult.data.status ?? 'pending',
        })
        setQrImages(codesResult.data)
        setTotalPages(Math.max(1, codesResult.meta.last_page))
      } finally {
        setIsLoading(false)
      }
    }
    void loadBatchDetail()
  }, [id, page])

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!id) return
    setFeedback('')
    const result = await adminCrudService.updateBatch(id, form)
    setBatch(result.data)
    setIsEditing(false)
    setFeedback('Lot QR mis a jour.')
  }

  async function handleDelete() {
    if (!id) return
    setIsDeleting(true)
    setFeedback('')
    try {
      await adminCrudService.deleteBatch(id)
      navigate('/admin/qr-codes')
    } catch {
      setFeedback('Echec suppression du lot QR.')
    } finally {
      setIsDeleting(false)
      setOpenDelete(false)
    }
  }

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

  if (isLoading) return <CenteredLoading label="Chargement lot QR..." minHeightClassName="min-h-[320px]" />
  if (!batch) return <p className="text-sm text-slate-600">Lot QR introuvable.</p>

  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <BackLink to="/admin/qr-codes" />
          <h1 className="text-4xl font-bold text-slate-900">Détail lot QR</h1>
          <p className="text-slate-600">{batch.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" type="button" onClick={() => setIsEditing((value) => !value)}>
            {isEditing ? 'Annuler' : 'Modifier'}
          </Button>
          <Button type="button" onClick={() => setOpenDelete(true)}>Supprimer</Button>
        </div>
      </header>
      {feedback ? <p className="text-sm text-emerald-700">{feedback}</p> : null}
      {isEditing ? (
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Modifier le lot QR</h2>
          <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleUpdate}>
            <input
              value={form.product_name}
              onChange={(event) => setForm((s) => ({ ...s, product_name: event.target.value }))}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
              placeholder="Nom produit du lot"
            />
            <input
              type="number"
              min={1}
              value={form.quantity}
              onChange={(event) => setForm((s) => ({ ...s, quantity: Number(event.target.value) }))}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
              placeholder="Quantite"
            />
            <select
              value={form.status}
              onChange={(event) => setForm((s) => ({ ...s, status: event.target.value }))}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
            >
              <option value="pending">pending</option>
              <option value="processing">processing</option>
              <option value="completed">completed</option>
              <option value="failed">failed</option>
              <option value="cancelled">cancelled</option>
            </select>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Sauvegarder</Button>
            </div>
          </form>
        </article>
      ) : null}
      <article className="rounded-2xl border border-slate-200 bg-white p-6">
        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div><dt className="text-xs uppercase text-slate-500">ID Lot</dt><dd>{batch.id}</dd></div>
          <div><dt className="text-xs uppercase text-slate-500">Créé le</dt><dd>{String(batch.created_at).slice(0, 10)}</dd></div>
          <div><dt className="text-xs uppercase text-slate-500">Produit</dt><dd>{batch.product_name}</dd></div>
          <div><dt className="text-xs uppercase text-slate-500">Quantité générée</dt><dd>{batch.total_generated}/{batch.quantity}</dd></div>
        </dl>
      </article>
      <article className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Images QR du lot (paginé)</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {qrImages.map((qr) => (
            <div key={qr.id} className="rounded-lg border border-slate-200 p-3">
              <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">OCC/NCD</p>
              <div className="mx-auto h-28 w-28 rounded-md border border-slate-200 bg-white">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qr.verification_url)}`}
                  alt={qr.id}
                  className="h-full w-full object-contain"
                />
              </div>
              {/* <p className="mt-2 text-center text-[11px] text-slate-500">N° séquentiel affiché</p> */}
              <p className="text-center text-xs font-semibold text-slate-700">{String(qr.serial).padStart(4, '0')}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => void downloadQrPng({ randomCode: qr.code })}
                  className="inline-flex items-center justify-center rounded-md border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Télécharger
                </button>
                <button
                  type="button"
                  onClick={() => void exportQrSvg({ randomCode: qr.code })}
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
        onConfirm={() => void handleDelete()}
        confirmLabel={isDeleting ? 'Suppression...' : 'Supprimer'}
      />
    </section>
  )
}
