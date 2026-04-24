import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function CompanyAddPage() {
  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Ajouter une entreprise</h1>
          <p className="text-slate-600">Créez une nouvelle entreprise dans le système NCD.</p>
        </div>
        <Link to="/admin/companies" className="text-sm font-medium text-brand-700 hover:underline">
          Retour à la liste
        </Link>
      </header>

      <article className="rounded-2xl border border-slate-200 bg-white p-6">
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Nom de l'entreprise" />
          <input className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Numéro d'enregistrement" />
          <input className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Email professionnel" />
          <input className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Téléphone" />
          <input className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Province" />
          <input className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Code province (ex: CD-KN)" />
          <input className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 md:col-span-2" placeholder="Adresse complète" />
          <div className="md:col-span-2 flex justify-end gap-2">
            <Link to="/admin/companies">
              <Button variant="ghost" type="button">Annuler</Button>
            </Link>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </article>
    </section>
  )
}
