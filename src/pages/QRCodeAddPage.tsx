import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function QRCodeAddPage() {
  const [productName, setProductName] = useState('')
  const [quantity, setQuantity] = useState(100)

  function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Générer un lot QR</h1>
          <p className="mt-1 text-slate-600">Configurez les paramètres d'authenticité de vos codes.</p>
        </div>
        <Link to="/admin/qr-codes" className="text-sm font-medium text-brand-700 hover:underline">
          Retour à la liste
        </Link>
      </header>

      <article className="rounded-2xl border border-slate-200 bg-white p-6">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 md:col-span-2"
            placeholder="Produit cible"
          />
          <input className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 md:col-span-2" placeholder="Certificat de vérification" />
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
            placeholder="Quantité"
          />
          <input className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Préfixe code" />
          <div className="md:col-span-2 flex justify-end gap-2">
            <Link to="/admin/qr-codes"><Button type="button" variant="ghost">Annuler</Button></Link>
            <Button type="submit">Générer les codes</Button>
          </div>
        </form>
      </article>
    </section>
  )
}
