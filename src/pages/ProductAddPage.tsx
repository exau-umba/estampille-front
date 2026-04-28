import { useState } from 'react'
import type { FormEvent } from 'react'
import { useEffect } from 'react'
import { FaCamera, FaCircleCheck, FaLink, FaPlus } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { adminCrudService, type CompanyDto } from '../services/adminCrudService'

export function ProductAddPage() {
  const [companyId, setCompanyId] = useState('')
  const [companies, setCompanies] = useState<CompanyDto[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [sku, setSku] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadCompanies() {
      const result = await adminCrudService.listCompanies(1, 200)
      setCompanies(result.data)
    }
    void loadCompanies()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const payload = new FormData()
    payload.append('company_id', companyId)
    payload.append('name', name)
    payload.append('description', description)
    payload.append('sku', sku)
    payload.append('status', 'published')
    if (imageFile) {
      payload.append('image_file', imageFile)
    }

    await adminCrudService.createProduct(payload)
    setMessage('Produit enregistre.')
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <BackLink to="/admin/products" label="Retour aux produits" />
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
            <form onSubmit={handleSubmit} className="space-y-3">
              <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Nom produit" />
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="h-32 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Description" />
              <select value={companyId} onChange={(event) => setCompanyId(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                <option value="">Selectionner une entreprise</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name} ({company.id})
                  </option>
                ))}
              </select>
              <input value={sku} onChange={(event) => setSku(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="SKU" />
              <p className="text-xs text-slate-500">ID étiquette généré automatiquement lors de la génération des QR codes.</p>
              {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
              <Button type="submit">Publier le produit</Button>
            </form>
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
            <label className="flex h-48 cursor-pointer items-center justify-center rounded-xl bg-slate-100">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              />
              <FaCamera className="h-9 w-9 text-slate-500" />
            </label>
            <p className="mt-3 text-sm text-slate-600">Importer une image produit</p>
            {imageFile ? <p className="text-xs text-emerald-700">{imageFile.name}</p> : null}
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
