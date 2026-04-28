import { useState } from 'react'
import type { FormEvent } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { FaCheck, FaCircleInfo, FaCloudArrowUp, FaShield } from 'react-icons/fa6'
import { adminCrudService, type ProductDto } from '../services/adminCrudService'

export function CertificateAddPage() {
  const [productId, setProductId] = useState('')
  const [products, setProducts] = useState<ProductDto[]>([])
  const [standard, setStandard] = useState('')
  const [certificateNumber, setCertificateNumber] = useState('')
  const [issuedAt, setIssuedAt] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadProducts() {
      const result = await adminCrudService.listProducts(1, 200)
      setProducts(result.data)
    }
    void loadProducts()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await adminCrudService.createCertificate({
      product_id: productId,
      standard,
      certificate_number: certificateNumber,
      issued_at: issuedAt || null,
      expires_at: expiresAt || null,
    })
    setMessage('Certificat enregistre.')
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold text-brand-700">Ajouter un certificat</h1>
        <p className="mt-1 text-slate-600">Liez des certifications institutionnelles aux produits vérifiés.</p>
      </header>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <select value={productId} onChange={(event) => setProductId(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
              <option value="">Selectionner un produit</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input value={standard} onChange={(event) => setStandard(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Norme" />
              <input value={certificateNumber} onChange={(event) => setCertificateNumber(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Numéro certificat" />
              <input value={issuedAt} onChange={(event) => setIssuedAt(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Date d'émission (YYYY-MM-DD)" />
              <input value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Date d'expiration (YYYY-MM-DD)" />
            </div>
            <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
              <FaCloudArrowUp className="mx-auto h-9 w-9 text-slate-400" />
              <p className="mt-2 font-medium text-brand-700">Cliquer pour téléverser ou glisser-déposer</p>
              <p className="text-sm text-slate-500">PDF uniquement, max 10MB</p>
            </div>
            <div className="flex justify-end gap-3">
              <Link to="/admin/certificates"><Button variant="ghost" type="button">Annuler</Button></Link>
              <Button type="submit">Enregistrer le certificat</Button>
            </div>
            {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
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
