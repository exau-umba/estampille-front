import { FaCamera, FaCircleCheck, FaLink, FaPlus } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function ProductAddPage() {
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/products" className="text-sm font-semibold text-brand-700 hover:underline">
            &larr; RETOUR AUX PRODUITS
          </Link>
          <h1 className="mt-1 text-5xl font-bold text-slate-900">Ajouter un produit</h1>
          <p className="mt-1 text-slate-600">Initialisez un produit dans le registre national.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products"><Button variant="secondary">Annuler</Button></Link>
          <Button>Publier</Button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="space-y-5 xl:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-3xl font-semibold text-slate-900">Identité & Spécifications</h2>
            <div className="space-y-3">
              <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Nom produit" />
              <textarea className="h-32 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Description" />
              <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Entreprise" />
              <p className="text-xs text-slate-500">ID étiquette généré automatiquement lors de la génération des QR codes.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-3xl font-semibold text-slate-900">Nœuds de traçabilité</h2>
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="font-medium text-emerald-800">Origine vérifiée</p>
              <p className="text-sm text-emerald-700">Kinshasa, RDC - Lot 402</p>
            </div>
            <button className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600">
              <FaPlus className="h-3 w-3" />
              Ajouter une étape
            </button>
          </div>
        </article>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex h-48 items-center justify-center rounded-xl bg-slate-100">
              <FaCamera className="h-9 w-9 text-slate-500" />
            </div>
            <p className="mt-3 text-sm text-slate-600">Importer une image produit</p>
          </div>
          <div className="rounded-2xl bg-[#0d1b46] p-5 text-white">
            <p className="text-xs uppercase tracking-wider text-blue-200">Protocole jumeau numérique</p>
            <p className="mt-1 text-3xl font-semibold">E-Identity NFT</p>
            <div className="mt-4 space-y-2 text-sm text-blue-100">
              <p>Hash ledger: 0x71C9...4FA2</p>
              <p className="inline-flex items-center gap-2"><FaCircleCheck className="h-3 w-3 text-emerald-300" />On-chain</p>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs">
              <FaLink className="h-3 w-3" />
              ID: GÉNÉRATION...
            </div>
          </div>
        </aside>
      </section>
    </section>
  )
}
