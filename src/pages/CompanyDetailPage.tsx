import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { companiesMock } from '../data/dashboardMock'
import { FaBuilding, FaLocationDot, FaShield } from 'react-icons/fa6'

export function CompanyDetailPage() {
  const { id } = useParams()
  const [openDelete, setOpenDelete] = useState(false)
  const company = companiesMock.find((item) => item.id === id)

  if (!company) {
    return <p className="text-sm text-slate-600">Entreprise introuvable.</p>
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <BackLink to="/admin/companies" />
          <h1 className="text-4xl font-bold text-slate-900">Détail entreprise</h1>
          <p className="text-slate-600">{company.name}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/companies/add">
            <Button variant="secondary">Modifier</Button>
          </Link>
          <Button type="button" onClick={() => setOpenDelete(true)}>Supprimer</Button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Logo entreprise</h2>
          <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center">
            <img src="/logos/Logo ncd.png" alt="Entreprise" className="mx-auto h-28 w-28 rounded-lg object-cover" />
            <p className="mt-3 text-sm font-medium text-brand-700">Identité vérifiée</p>
          </div>
          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="font-medium text-slate-900">Intégrité profil</p>
            <div className="mt-3 h-2 rounded-full bg-slate-200"><div className="h-2 w-3/4 rounded-full bg-brand-600" /></div>
          </div>
        </article>
        <div className="space-y-5 xl:col-span-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-slate-900"><FaBuilding className="h-4 w-4 text-brand-600" />Informations entreprise</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><dt className="text-xs uppercase text-slate-500">ID</dt><dd>{company.id}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Statut</dt><dd>{company.status}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Nom légal</dt><dd>{company.name}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">N° enregistrement</dt><dd>REG-2023-8842-X</dd></div>
            </div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-slate-900"><FaLocationDot className="h-4 w-4 text-emerald-600" />Localisation</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><dt className="text-xs uppercase text-slate-500">Pays</dt><dd>RDC</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Province</dt><dd>Kinshasa</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Code province</dt><dd>CD-KN</dd></div>
              <div className="md:col-span-2"><dt className="text-xs uppercase text-slate-500">Adresse</dt><dd>12 Avenue du Commerce, Gombe</dd></div>
            </div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-slate-900"><FaShield className="h-4 w-4 text-amber-600" />Contact & conformité</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><dt className="text-xs uppercase text-slate-500">Email</dt><dd>{company.email}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Téléphone</dt><dd>+243 999 000 001</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Site web</dt><dd>https://ncd.gouv.cd</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Niveau conformité</dt><dd>Élevé</dd></div>
            </div>
          </article>
        </div>
      </section>

      <ConfirmDialog
        isOpen={openDelete}
        title="Confirmer la suppression"
        message="Cette action est irréversible. Voulez-vous continuer ?"
        onCancel={() => setOpenDelete(false)}
        onConfirm={() => setOpenDelete(false)}
        confirmLabel="Supprimer"
      />
    </section>
  )
}
