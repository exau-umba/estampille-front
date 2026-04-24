import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Pagination } from '../components/ui/Pagination'
import { productsMock } from '../data/dashboardMock'
import { FaEye, FaTrashCan } from 'react-icons/fa6'

export function ProductsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 5
  const totalPages = Math.ceil(productsMock.length / perPage)
  const paginated = productsMock.slice((page - 1) * perPage, page * perPage)

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mt-1 text-4xl font-bold text-slate-900">Liste des produits</h1>
          <p className="mt-1 text-slate-600">Consultez et gérez tous les produits certifiés.</p>
        </div>
        <Link to="/admin/products/add"><Button>Ajouter un produit</Button></Link>
      </header>

      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3">ID</th>
                <th className="pb-3">Produit</th>
                <th className="pb-3">ID étiquette</th>
                <th className="pb-3">Entreprise</th>
                <th className="pb-3">Statut</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((product) => (
                <tr key={product.id} className="border-t border-slate-100">
                  <td className="py-3 font-medium text-brand-700">{product.id}</td>
                  <td className="py-3">{product.name}</td>
                  <td className="py-3">{product.sku}</td>
                  <td className="py-3">{product.company}</td>
                  <td className="py-3">{product.status}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/products/${product.id}`} className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline">
                        <FaEye className="h-3.5 w-3.5" />
                        Voir
                      </Link>
                      <button type="button" onClick={() => setDeleteId(product.id)} className="inline-flex cursor-pointer items-center gap-1 text-sm text-rose-600 hover:underline">
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
      </article>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Supprimer le produit"
        message={`Confirmez la suppression de ${deleteId ?? ''}.`}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => setDeleteId(null)}
        confirmLabel="Supprimer"
      />
    </section>
  )
}
