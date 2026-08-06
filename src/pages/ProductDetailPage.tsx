import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { CenteredLoading } from '../components/ui/CenteredLoading'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { adminCrudService, type CompanyDto, type ProductDto } from '../services/adminCrudService'
import { FaCamera, FaCircleCheck, FaLink } from 'react-icons/fa6'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [openDelete, setOpenDelete] = useState(false)
  const [product, setProduct] = useState<ProductDto | null>(null)
  const [companies, setCompanies] = useState<CompanyDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    company_id: '',
    name: '',
    description: '',
    sku: '',
    status: 'published',
  })

  useEffect(() => {
    async function loadProduct() {
      if (!id) return
      setIsLoading(true)
      try {
        const [productResult, companiesResult] = await Promise.all([
          adminCrudService.getProduct(id),
          adminCrudService.listCompanies(1, 200),
        ])
        setProduct(productResult.data)
        setCompanies(companiesResult.data)
        setForm({
          company_id: productResult.data.company_id ?? '',
          name: productResult.data.name ?? '',
          description: productResult.data.description ?? '',
          sku: productResult.data.sku ?? '',
          status: productResult.data.status ?? 'published',
        })
      } finally {
        setIsLoading(false)
      }
    }
    void loadProduct()
  }, [id])

  async function handleDelete() {
    if (!id) return
    await adminCrudService.deleteProduct(id)
    navigate('/admin/products')
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!id) return
    setFeedback('')
    setIsSaving(true)
    try {
      const payload = new FormData()
      payload.append('name', form.name)
      payload.append('sku', form.sku)
      payload.append('company_id', form.company_id)
      payload.append('status', form.status)
      payload.append('description', form.description)
      if (imageFile) {
        payload.append('image_file', imageFile)
      }

      const result = await adminCrudService.updateProduct(id, payload)
      setProduct(result.data)
      setIsEditing(false)
      setImageFile(null)
      setFeedback('Produit mis à jour avec succès.')
    } catch (err) {
      console.error(err)
      setFeedback('Erreur lors de la mise à jour.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <CenteredLoading label="Chargement produit..." minHeightClassName="min-h-[320px]" />
  if (!product) return <p className="text-sm text-slate-600">Produit introuvable.</p>

  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <BackLink to="/admin/products" />
          <h1 className="text-4xl font-bold text-slate-900">Détail produit</h1>
          <p className="text-slate-600">{product.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" type="button" onClick={() => setIsEditing((value) => !value)}>
            {isEditing ? 'Annuler' : 'Modifier'}
          </Button>
          <Button type="button" onClick={() => setOpenDelete(true)}>Supprimer</Button>
        </div>
      </header>
      {feedback ? <p className="text-sm font-medium text-emerald-700">{feedback}</p> : null}

      {isEditing ? (
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Modifier le produit</h2>
          <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleUpdate}>
            <input value={form.name} onChange={(event) => setForm((s) => ({ ...s, name: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Nom produit" required />
            <input value={form.sku} onChange={(event) => setForm((s) => ({ ...s, sku: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="SKU" required />
            <select value={form.company_id} onChange={(event) => setForm((s) => ({ ...s, company_id: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
              <option value="">Sélectionner une entreprise</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            <select value={form.status} onChange={(event) => setForm((s) => ({ ...s, status: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
              <option value="published">published</option>
              <option value="draft">draft</option>
              <option value="archived">archived</option>
            </select>
            <textarea value={form.description} onChange={(event) => setForm((s) => ({ ...s, description: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 md:col-span-2" placeholder="Description" />
            
            <div className="md:col-span-2 space-y-2 rounded-xl bg-slate-50 p-3 border border-slate-200">
              <label className="block text-xs font-semibold uppercase text-slate-500">Changer l'image du produit</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                className="text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-brand-700"
              />
              {imageFile ? <p className="text-xs font-medium text-emerald-700">Nouvelle image : {imageFile.name}</p> : null}
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Enregistrement...' : 'Sauvegarder'}
              </Button>
            </div>
          </form>
        </article>
      ) : null}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="space-y-5 xl:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-3xl font-semibold text-slate-900">Identité & spécifications</h2>
            <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><dt className="text-xs uppercase text-slate-500">ID produit</dt><dd className="font-mono text-xs">{product.id}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Statut</dt><dd><span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">{product.status}</span></dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Produit</dt><dd className="font-semibold text-slate-800">{product.name}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">SKU / ID étiquette</dt><dd className="font-mono text-xs text-slate-700">{product.sku}</dd></div>
              <div className="md:col-span-2"><dt className="text-xs uppercase text-slate-500">Entreprise</dt><dd className="font-medium text-slate-800">{product.company?.name ?? '-'}</dd></div>
              {product.description ? (
                <div className="md:col-span-2"><dt className="text-xs uppercase text-slate-500">Description</dt><dd className="text-sm text-slate-600">{product.description}</dd></div>
              ) : null}
            </dl>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-3xl font-semibold text-slate-900">Nœuds de traçabilité</h2>
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="font-medium text-emerald-800">Origine vérifiée</p>
              <p className="text-sm text-emerald-700">Kinshasa, RDC - Lot 402</p>
            </div>
          </div>
        </article>
        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-48 w-full rounded-xl object-cover" />
            ) : (
              <div className="flex h-48 items-center justify-center rounded-xl bg-slate-100">
                <FaCamera className="h-9 w-9 text-slate-500" />
              </div>
            )}
            <p className="mt-3 text-sm font-medium text-slate-700">Photo du produit</p>
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
        onConfirm={() => void handleDelete()}
        confirmLabel="Supprimer"
      />
    </section>
  )
}
