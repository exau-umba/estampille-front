import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { FaCheck, FaCircleInfo, FaCloudArrowUp, FaShield } from 'react-icons/fa6'

export function CertificateAddPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold text-brand-700">Ajouter un certificat</h1>
        <p className="mt-1 text-slate-600">Liez des certifications institutionnelles aux produits vérifiés.</p>
      </header>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <form className="space-y-4">
            <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Produit lié" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Norme" />
              <input className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Numéro certificat" />
              <input className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Date d'émission" />
              <input className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Date d'expiration" />
            </div>
            <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
              <FaCloudArrowUp className="mx-auto h-9 w-9 text-slate-400" />
              <p className="mt-2 font-medium text-brand-700">Cliquer pour téléverser ou glisser-déposer</p>
              <p className="text-sm text-slate-500">PDF uniquement, max 10MB</p>
            </div>
            <div className="flex justify-end gap-3">
              <Link to="/admin/certificates"><Button variant="ghost" type="button">Annuler</Button></Link>
              <Button type="button">Enregistrer le certificat</Button>
            </div>
          </form>
        </article>

        <div className="space-y-4">
          <article className="rounded-2xl border border-emerald-200 bg-white p-5">
            <h3 className="mb-2 text-xl font-semibold text-slate-900">Indicateur de confiance</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="inline-flex items-center gap-2"><FaCheck className="h-3 w-3 text-emerald-600" />Intégrité blockchain</li>
              <li className="inline-flex items-center gap-2"><FaCheck className="h-3 w-3 text-emerald-600" />Cross-check métadonnées</li>
              <li className="inline-flex items-center gap-2 text-slate-500"><FaCircleInfo className="h-3 w-3" />En attente document</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-brand-700"><FaShield className="h-4 w-4" />Journal d'audit</h3>
            <p className="mt-2 text-sm text-slate-600">Chaque modification est enregistrée de manière immuable.</p>
          </article>
        </div>
      </section>
    </section>
  )
}
