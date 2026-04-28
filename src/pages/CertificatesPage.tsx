import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { CenteredLoading } from '../components/ui/CenteredLoading'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Pagination } from '../components/ui/Pagination'
import { adminCrudService, type CertificateDto } from '../services/adminCrudService'
import { FaEye, FaTrashCan } from 'react-icons/fa6'

export function CertificatesPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<CertificateDto[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const perPage = 5

  useEffect(() => {
    async function loadCertificates() {
      setIsLoading(true)
      setError('')
      try {
        const result = await adminCrudService.listCertificates(page, perPage)
        setItems(result.data)
        setTotalPages(Math.max(1, result.meta.last_page))
      } catch {
        setError('Impossible de charger les certificats.')
      } finally {
        setIsLoading(false)
      }
    }
    void loadCertificates()
  }, [page])

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Liste des certificats</h1>
          <p className="mt-1 text-slate-600">Historique de tous les certificats publiés.</p>
        </div>
        <Link to="/admin/certificates/add"><Button>Ajouter un certificat</Button></Link>
      </header>

      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}
        {isLoading ? (
          <CenteredLoading label="Chargement des certificats..." minHeightClassName="min-h-[220px]" />
        ) : null}
        {!isLoading ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3">ID</th>
                <th className="pb-3">Produit</th>
                <th className="pb-3">Norme</th>
                <th className="pb-3">Valide jusqu'au</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((certificate) => (
                <tr key={certificate.id} className="border-t border-slate-100">
                  <td className="py-3 font-medium text-brand-700">{certificate.certificate_number}</td>
                  <td className="py-3">{certificate.product?.name ?? '-'}</td>
                  <td className="py-3">{certificate.standard ?? '-'}</td>
                  <td className="py-3">{certificate.expires_at ?? '-'}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/certificates/${certificate.id}`} className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline">
                        <FaEye className="h-3.5 w-3.5" />
                        Voir
                      </Link>
                      <button type="button" onClick={() => setDeleteId(certificate.id)} className="inline-flex cursor-pointer items-center gap-1 text-sm text-rose-600 hover:underline">
                        <FaTrashCan className="h-3.5 w-3.5" />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ) : null}
      </article>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Supprimer le certificat"
        message={`Confirmez la suppression de ${deleteId ?? ''}.`}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => setDeleteId(null)}
        confirmLabel="Supprimer"
      />
    </section>
  )
}
