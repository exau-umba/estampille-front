import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { CenteredLoading } from '../components/ui/CenteredLoading'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Pagination } from '../components/ui/Pagination'
import { adminCrudService, type BatchDto } from '../services/adminCrudService'
import { FaEye, FaMagnifyingGlass, FaTrashCan } from 'react-icons/fa6'

export function QRCodesPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<BatchDto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const perPage = 4
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    async function loadBatches() {
      setIsLoading(true)
      setError('')
      try {
        const result = await adminCrudService.listBatches(page, perPage)
        setItems(result.data)
        setTotalPages(Math.max(1, result.meta.last_page))
      } catch {
        setError('Impossible de charger les lots QR.')
      } finally {
        setIsLoading(false)
      }
    }
    void loadBatches()
  }, [page])

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Liste des lots QR générés</h1>
          <p className="mt-1 text-slate-600">Suivez l'ensemble des lots et leur statut.</p>
        </div>
        <Link to="/admin/qr-codes/add"><Button>Ajouter un lot QR</Button></Link>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          ['Scans totaux', '12 482'],
          ['Lots actifs', '34'],
          ['Intégrité', '99.9%'],
        ].map((item) => (
          <article key={item[0]} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{item[0]}</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">{item[1]}</p>
          </article>
        ))}
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-3 relative w-full max-w-xs">
          <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
          <input className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm" placeholder="Rechercher un lot..." />
        </div>
        {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}
        {isLoading ? (
          <CenteredLoading label="Chargement des lots QR..." minHeightClassName="min-h-[220px]" />
        ) : (
          <div className="space-y-3">
          {items.map((batch) => (
            <div key={batch.id} className="grid grid-cols-1 gap-3 rounded-lg border border-slate-100 p-3 text-sm md:grid-cols-6 md:items-center">
              <p className="font-semibold text-brand-700">{batch.id}</p>
              <p className="md:col-span-2 text-slate-700">{batch.product_name}</p>
              <p className="text-slate-700">{batch.total_generated.toLocaleString()} / {batch.quantity.toLocaleString()} codes</p>
              <p className="text-slate-500">{String(batch.created_at).slice(0, 10)}</p>
              <div className="flex gap-2 md:justify-end">
                <Link to={`/admin/qr-codes/${batch.id}`} className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline">
                  <FaEye className="h-3.5 w-3.5" />
                  Voir
                </Link>
                <button type="button" onClick={() => setDeleteId(batch.id)} className="inline-flex cursor-pointer items-center gap-1 text-sm text-rose-600 hover:underline">
                  <FaTrashCan className="h-3.5 w-3.5" />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
          </div>
        )}
      </article>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Supprimer le lot QR"
        message={`Confirmez la suppression de ${deleteId ?? ''}.`}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => setDeleteId(null)}
        confirmLabel="Supprimer"
      />
    </section>
  )
}
