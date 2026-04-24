import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { productsMock } from '../data/dashboardMock'
import { FaCamera, FaCircleCheck, FaLink } from 'react-icons/fa6'

export function ProductDetailPage() {
  const { id } = useParams()
  const [openDelete, setOpenDelete] = useState(false)
  const product = productsMock.find((item) => item.id === id)

  if (!product) return <p className="text-sm text-slate-600">Produit introuvable.</p>

  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <Link to="/admin/products" className="text-sm font-semibold text-brand-700 hover:underline">
            &larr; Retour à la liste
          </Link>
          <h1 className="text-4xl font-bold text-slate-900">Détail produit</h1>
          <p className="text-slate-600">{product.name}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products/add"><Button variant="secondary">Modifier</Button></Link>
          <Button type="button" onClick={() => setOpenDelete(true)}>Supprimer</Button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="space-y-5 xl:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-3xl font-semibold text-slate-900">Identité & spécifications</h2>
            <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><dt className="text-xs uppercase text-slate-500">ID produit</dt><dd>{product.id}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Statut</dt><dd>{product.status}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Produit</dt><dd>{product.name}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">ID étiquette</dt><dd>{product.sku}</dd></div>
              <div className="md:col-span-2"><dt className="text-xs uppercase text-slate-500">Entreprise</dt><dd>{product.company}</dd></div>
            </dl>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-3xl font-semibold text-slate-900">Nœuds de traçabilité</h2>
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="font-medium text-emerald-800">Origine vérifiée</p>
              <p className="text-sm text-emerald-700">Kivu, RDC - Lot 402</p>
            </div>
          </div>
        </article>
        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex h-48 items-center justify-center rounded-xl bg-slate-100"><FaCamera className="h-9 w-9 text-slate-500" /></div>
            <p className="mt-3 text-sm text-slate-600">Médias produit</p>
          </div>
          <div className="rounded-2xl bg-[#0d1b46] p-5 text-white">
            <p className="text-xs uppercase tracking-wider text-blue-200">Protocole jumeau numérique</p>
            <p className="mt-1 text-3xl font-semibold">E-Identity NFT</p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-blue-100"><FaCircleCheck className="h-3 w-3 text-emerald-300" />Ancré on-chain</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs"><FaLink className="h-3 w-3" />ID: NFT-8842-991</div>
          </div>
        </aside>
      </section>

      <ConfirmDialog
        isOpen={openDelete}
        title="Confirmer la suppression"
        message="Cette action est irréversible."
        onCancel={() => setOpenDelete(false)}
        onConfirm={() => setOpenDelete(false)}
        confirmLabel="Supprimer"
      />
    </section>
  )
}
