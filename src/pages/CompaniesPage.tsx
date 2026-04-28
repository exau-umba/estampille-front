import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { CenteredLoading } from '../components/ui/CenteredLoading'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Pagination } from '../components/ui/Pagination'
import { adminCrudService, type CompanyDto } from '../services/adminCrudService'
import { FaEye, FaTrashCan } from 'react-icons/fa6'

export function CompaniesPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<CompanyDto[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const perPage = 5

  useEffect(() => {
    async function loadCompanies() {
      setIsLoading(true)
      setError('')
      try {
        const result = await adminCrudService.listCompanies(page, perPage)
        setItems(result.data)
        setTotalPages(Math.max(1, result.meta.last_page))
      } catch {
        setError('Impossible de charger les entreprises.')
      } finally {
        setIsLoading(false)
      }
    }
    void loadCompanies()
  }, [page])

  async function handleDelete() {
    if (!deleteId) return
    await adminCrudService.deleteCompany(deleteId)
    setDeleteId(null)
    const result = await adminCrudService.listCompanies(page, perPage)
    setItems(result.data)
    setTotalPages(Math.max(1, result.meta.last_page))
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Liste des entreprises</h1>
          <p className="text-slate-600">Gérez toutes les entreprises enregistrées.</p>
        </div>
        <Link to="/admin/companies/add">
          <Button>Ajouter une entreprise</Button>
        </Link>
      </header>

      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}
        {isLoading ? (
          <CenteredLoading label="Chargement des entreprises..." minHeightClassName="min-h-[220px]" />
        ) : null}
        {!isLoading ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3">ID</th>
                <th className="pb-3">Nom</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Statut</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((company) => (
                <tr key={company.id} className="border-t border-slate-100">
                  <td className="py-3 font-medium text-brand-700">{company.id}</td>
                  <td className="py-3">{company.name}</td>
                  <td className="py-3">{company.email}</td>
                  <td className="py-3">{company.status}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/companies/${company.id}`} className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline">
                        <FaEye className="h-3.5 w-3.5" />
                        Voir
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(company.id)}
                        className="inline-flex cursor-pointer items-center gap-1 text-sm text-rose-600 hover:underline"
                      >
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
        title="Supprimer l'entreprise"
        message={`Voulez-vous vraiment supprimer ${deleteId ?? ''} ?`}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void handleDelete()}
        confirmLabel="Supprimer"
      />
    </section>
  )
}
