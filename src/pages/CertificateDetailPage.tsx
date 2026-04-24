import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { certificatesMock } from '../data/dashboardMock'
import { FaCheck, FaCircleInfo, FaCloudArrowUp, FaShield } from 'react-icons/fa6'

export function CertificateDetailPage() {
  const { id } = useParams()
  const [openDelete, setOpenDelete] = useState(false)
  const certificate = certificatesMock.find((item) => item.id === id)

  if (!certificate) return <p className="text-sm text-slate-600">Certificat introuvable.</p>

  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <Link to="/admin/certificates" className="text-sm font-semibold text-brand-700 hover:underline">
            &larr; Retour à la liste
          </Link>
          <h1 className="text-4xl font-bold text-slate-900">Détail certificat</h1>
          <p className="text-slate-600">{certificate.id}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/certificates/add"><Button variant="secondary">Modifier</Button></Link>
          <Button type="button" onClick={() => setOpenDelete(true)}>Supprimer</Button>
        </div>
      </header>
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div><dt className="text-xs uppercase text-slate-500">ID</dt><dd>{certificate.id}</dd></div>
            <div><dt className="text-xs uppercase text-slate-500">Produit</dt><dd>{certificate.product}</dd></div>
            <div><dt className="text-xs uppercase text-slate-500">Norme</dt><dd>{certificate.standard}</dd></div>
            <div><dt className="text-xs uppercase text-slate-500">Date d'expiration</dt><dd>{certificate.validUntil}</dd></div>
          </div>
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-10 text-center">
            <FaCloudArrowUp className="mx-auto h-9 w-9 text-slate-400" />
            <p className="mt-2 font-medium text-brand-700">Document PDF disponible</p>
          </div>
        </article>
        <div className="space-y-4">
          <article className="rounded-2xl border border-emerald-200 bg-white p-5">
            <h3 className="mb-2 text-xl font-semibold text-slate-900">Indicateur de confiance</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="inline-flex items-center gap-2"><FaCheck className="h-3 w-3 text-emerald-600" />Intégrité blockchain</li>
              <li className="inline-flex items-center gap-2"><FaCheck className="h-3 w-3 text-emerald-600" />Cross-check métadonnées</li>
              <li className="inline-flex items-center gap-2 text-slate-500"><FaCircleInfo className="h-3 w-3" />Document valide</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-brand-700"><FaShield className="h-4 w-4" />Journal d'audit</h3>
            <p className="mt-2 text-sm text-slate-600">Dernière mise à jour : 2026-04-22 par Admin.</p>
          </article>
        </div>
      </section>
      <ConfirmDialog
        isOpen={openDelete}
        title="Confirmer la suppression"
        message="Voulez-vous supprimer ce certificat ?"
        onCancel={() => setOpenDelete(false)}
        onConfirm={() => setOpenDelete(false)}
        confirmLabel="Supprimer"
      />
    </section>
  )
}
