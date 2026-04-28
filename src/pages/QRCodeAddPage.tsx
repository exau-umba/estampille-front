import { type FormEvent, useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { adminCrudService, type CertificateDto, type CompanyDto, type ProductDto } from '../services/adminCrudService'

export function QRCodeAddPage() {
  const [companyId, setCompanyId] = useState('')
  const [productId, setProductId] = useState('')
  const [certificateId, setCertificateId] = useState('')
  const [companies, setCompanies] = useState<CompanyDto[]>([])
  const [products, setProducts] = useState<ProductDto[]>([])
  const [certificates, setCertificates] = useState<CertificateDto[]>([])
  const [quantity, setQuantity] = useState(100)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadReferences() {
      const [companiesResult, productsResult, certificatesResult] = await Promise.all([
        adminCrudService.listCompanies(1, 200),
        adminCrudService.listProducts(1, 200),
        adminCrudService.listCertificates(1, 200),
      ])
      setCompanies(companiesResult.data)
      setProducts(productsResult.data)
      setCertificates(certificatesResult.data)
    }
    void loadReferences()
  }, [])

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await adminCrudService.createBatch({
      company_id: companyId,
      product_id: productId,
      certificate_id: certificateId,
      quantity,
    })
    setMessage('Lot QR en file de generation.')
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Générer un lot QR</h1>
          <p className="mt-1 text-slate-600">Configurez les paramètres d'authenticité de vos codes.</p>
        </div>
        <BackLink to="/admin/qr-codes" />
      </header>

      <article className="rounded-2xl border border-slate-200 bg-white p-6">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <select value={companyId} onChange={(event) => setCompanyId(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 md:col-span-2">
            <option value="">Selectionner entreprise</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
          <select value={productId} onChange={(event) => setProductId(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 md:col-span-2">
            <option value="">Selectionner produit</option>
            {products.filter((item) => !companyId || item.company_id === companyId).map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
          <select value={certificateId} onChange={(event) => setCertificateId(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 md:col-span-2">
            <option value="">Selectionner certificat</option>
            {certificates.filter((item) => !productId || item.product_id === productId).map((certificate) => (
              <option key={certificate.id} value={certificate.id}>{certificate.certificate_number}</option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
            placeholder="Quantité"
          />
          <input className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-3 text-slate-400" placeholder="Code QR: alphanumérique 4 caractères (auto)" disabled />
          {message ? <p className="md:col-span-2 text-sm text-emerald-700">{message}</p> : null}
          <div className="md:col-span-2 flex justify-end gap-2">
            <Link to="/admin/qr-codes"><Button type="button" variant="ghost">Annuler</Button></Link>
            <Button type="submit">Générer les codes</Button>
          </div>
        </form>
      </article>
    </section>
  )
}
