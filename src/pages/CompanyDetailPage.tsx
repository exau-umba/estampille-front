import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { CenteredLoading } from '../components/ui/CenteredLoading'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { adminCrudService, type CompanyDto } from '../services/adminCrudService'
import { FaBuilding, FaLocationDot, FaShield } from 'react-icons/fa6'

export function CompanyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [openDelete, setOpenDelete] = useState(false)
  const [company, setCompany] = useState<CompanyDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [form, setForm] = useState({
    name: '',
    registration_number: '',
    email: '',
    phone: '',
    website: '',
    country: '',
    province: '',
    province_code: '',
    address: '',
    status: 'active',
  })

  useEffect(() => {
    async function loadCompany() {
      if (!id) return
      setIsLoading(true)
      setError('')
      try {
        const result = await adminCrudService.getCompany(id)
        setCompany(result.data)
        setForm({
          name: result.data.name ?? '',
          registration_number: result.data.registration_number ?? '',
          email: result.data.email ?? '',
          phone: result.data.phone ?? '',
          website: result.data.website ?? '',
          country: result.data.country ?? '',
          province: result.data.province ?? '',
          province_code: result.data.province_code ?? '',
          address: result.data.address ?? '',
          status: result.data.status ?? 'active',
        })
      } catch {
        setError('Entreprise introuvable.')
      } finally {
        setIsLoading(false)
      }
    }
    void loadCompany()
  }, [id])

  async function handleDelete() {
    if (!id) return
    await adminCrudService.deleteCompany(id)
    navigate('/admin/companies')
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!id) return
    setIsSaving(true)
    setFeedback('')
    try {
      const result = await adminCrudService.updateCompany(id, form)
      setCompany(result.data)
      setIsEditing(false)
      setFeedback('Entreprise mise a jour.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <CenteredLoading label="Chargement entreprise..." minHeightClassName="min-h-[320px]" />
  }

  if (!company) {
    return <p className="text-sm text-rose-600">{error || 'Entreprise introuvable.'}</p>
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
          <Button variant="secondary" type="button" onClick={() => setIsEditing((value) => !value)}>
            {isEditing ? 'Annuler' : 'Modifier'}
          </Button>
          <Button type="button" onClick={() => setOpenDelete(true)}>Supprimer</Button>
        </div>
      </header>
      {feedback ? <p className="text-sm text-emerald-700">{feedback}</p> : null}

      {isEditing ? (
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Modifier l'entreprise</h2>
          <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleUpdate}>
            <input value={form.name} onChange={(event) => setForm((s) => ({ ...s, name: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Nom" required />
            <input value={form.registration_number} onChange={(event) => setForm((s) => ({ ...s, registration_number: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Numero d'enregistrement" />
            <input value={form.email} onChange={(event) => setForm((s) => ({ ...s, email: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Email" />
            <input value={form.phone} onChange={(event) => setForm((s) => ({ ...s, phone: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Telephone" />
            <input value={form.website} onChange={(event) => setForm((s) => ({ ...s, website: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 md:col-span-2" placeholder="Site web" />
            <input value={form.country} onChange={(event) => setForm((s) => ({ ...s, country: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Pays" />
            <input value={form.province} onChange={(event) => setForm((s) => ({ ...s, province: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Province" />
            <input value={form.province_code} onChange={(event) => setForm((s) => ({ ...s, province_code: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Code province" />
            <select value={form.status} onChange={(event) => setForm((s) => ({ ...s, status: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
            <input value={form.address} onChange={(event) => setForm((s) => ({ ...s, address: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 md:col-span-2" placeholder="Adresse" />
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">{isSaving ? 'Enregistrement...' : 'Sauvegarder'}</Button>
            </div>
          </form>
        </article>
      ) : null}

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
              <div><dt className="text-xs uppercase text-slate-500">N° enregistrement</dt><dd>{company.registration_number ?? '-'}</dd></div>
            </div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-slate-900"><FaLocationDot className="h-4 w-4 text-emerald-600" />Localisation</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><dt className="text-xs uppercase text-slate-500">Pays</dt><dd>{company.country ?? '-'}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Province</dt><dd>{company.province ?? '-'}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Code province</dt><dd>{company.province_code ?? '-'}</dd></div>
              <div className="md:col-span-2"><dt className="text-xs uppercase text-slate-500">Adresse</dt><dd>{company.address ?? '-'}</dd></div>
            </div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-slate-900"><FaShield className="h-4 w-4 text-amber-600" />Contact & conformité</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><dt className="text-xs uppercase text-slate-500">Email</dt><dd>{company.email}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Téléphone</dt><dd>{company.phone ?? '-'}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Site web</dt><dd>{company.website ?? '-'}</dd></div>
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
        onConfirm={() => void handleDelete()}
        confirmLabel="Supprimer"
      />
    </section>
  )
}
