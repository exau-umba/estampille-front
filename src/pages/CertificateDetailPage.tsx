import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { CenteredLoading } from '../components/ui/CenteredLoading'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { adminCrudService, type CertificateDto, type ProductDto } from '../services/adminCrudService'
import { FaCheck, FaCircleInfo, FaCloudArrowUp, FaShield } from 'react-icons/fa6'

export function CertificateDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [openDelete, setOpenDelete] = useState(false)
  const [certificate, setCertificate] = useState<CertificateDto | null>(null)
  const [products, setProducts] = useState<ProductDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [form, setForm] = useState({
    product_id: '',
    standard: '',
    certificate_number: '',
    issued_at: '',
    expires_at: '',
  })

  useEffect(() => {
    async function loadCertificate() {
      if (!id) return
      setIsLoading(true)
      try {
        const [certificateResult, productsResult] = await Promise.all([
          adminCrudService.getCertificate(id),
          adminCrudService.listProducts(1, 200),
        ])
        setCertificate(certificateResult.data)
        setProducts(productsResult.data)
        setForm({
          product_id: certificateResult.data.product_id ?? '',
          standard: certificateResult.data.standard ?? '',
          certificate_number: certificateResult.data.certificate_number ?? '',
          issued_at: certificateResult.data.issued_at?.slice(0, 10) ?? '',
          expires_at: certificateResult.data.expires_at?.slice(0, 10) ?? '',
        })
      } finally {
        setIsLoading(false)
      }
    }
    void loadCertificate()
  }, [id])

  async function handleDelete() {
    if (!id) return
    await adminCrudService.deleteCertificate(id)
    navigate('/admin/certificates')
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!id) return
    setFeedback('')
    const result = await adminCrudService.updateCertificate(id, {
      ...form,
      issued_at: form.issued_at || null,
      expires_at: form.expires_at || null,
    })
    setCertificate(result.data)
    setIsEditing(false)
    setFeedback('Certificat mis a jour.')
  }

  if (isLoading) return <CenteredLoading label="Chargement certificat..." minHeightClassName="min-h-[320px]" />
  if (!certificate) return <p className="text-sm text-slate-600">Certificat introuvable.</p>

  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <BackLink to="/admin/certificates" />
          <h1 className="text-4xl font-bold text-slate-900">Détail certificat</h1>
          <p className="text-slate-600">{certificate.certificate_number}</p>
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
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Modifier le certificat</h2>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <select value={form.product_id} onChange={(event) => setForm((s) => ({ ...s, product_id: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
              <option value="">Selectionner un produit</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
            <input value={form.certificate_number} onChange={(event) => setForm((s) => ({ ...s, certificate_number: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Numero certificat" required />
            <input value={form.standard} onChange={(event) => setForm((s) => ({ ...s, standard: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Norme" />
            <input value={form.issued_at} onChange={(event) => setForm((s) => ({ ...s, issued_at: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Date d'emission YYYY-MM-DD" />
            <input value={form.expires_at} onChange={(event) => setForm((s) => ({ ...s, expires_at: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Date expiration YYYY-MM-DD" />
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Sauvegarder</Button>
            </div>
          </form>
        </article>
      ) : null}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div><dt className="text-xs uppercase text-slate-500">ID</dt><dd>{certificate.id}</dd></div>
            <div><dt className="text-xs uppercase text-slate-500">Produit</dt><dd>{certificate.product?.name ?? '-'}</dd></div>
            <div><dt className="text-xs uppercase text-slate-500">Norme</dt><dd>{certificate.standard ?? '-'}</dd></div>
            <div><dt className="text-xs uppercase text-slate-500">Date d'expiration</dt><dd>{certificate.expires_at ?? '-'}</dd></div>
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
        onConfirm={() => void handleDelete()}
        confirmLabel="Supprimer"
      />
    </section>
  )
}
