import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { verificationService } from '../services/verificationService'

export function ReportCounterfeitPage() {
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [contact, setContact] = useState('')
  const [productImage, setProductImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!productImage) {
      setError('Image requise pour envoyer le signalement.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setMessage('')
    try {
      const payload = new FormData()
      payload.append('location', location)
      payload.append('description', description)
      payload.append('contact', contact)
      payload.append('image', productImage)
      const result = await verificationService.reportCounterfeit(payload)

      setMessage(result.message || 'Signalement envoye. Merci pour votre vigilance.')
      setDescription('')
      setLocation('')
      setContact('')
      setProductImage(null)
      setImagePreview('')
    } catch {
      setError('Echec envoi signalement. Veuillez reessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setProductImage(file)

    if (!file) {
      setImagePreview('')
      return
    }

    const reader = new FileReader()
    reader.onload = () => setImagePreview(typeof reader.result === 'string' ? reader.result : '')
    reader.readAsDataURL(file)
  }

  return (
    <main className="min-h-screen bg-[#f5f6fb]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logos/logo-min-industrie.jpg" alt="Logo INDUSTRY" className="h-10 w-auto object-contain" />
            <img src="/logos/logo-occ.png" alt="Logo OCC" className="h-8 w-auto object-contain" />
            <img src="/logos/Logo ncd.png" alt="Logo application" className="h-8 w-8 rounded-md object-cover" />
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-230px)] max-w-6xl items-center justify-center px-4 py-8 sm:px-8">
        <article className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-3xl font-bold text-slate-900">Signaler un faux produit</h1>
          <p className="mt-2 text-slate-600">
            Renseignez les informations ci-dessous pour transmettre votre signalement.
          </p>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
              placeholder="Lieu d'achat ou d'observation"
              required
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Image du produit signale</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium"
                required
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Apercu produit signale"
                  className="h-48 w-full rounded-xl border border-slate-200 object-cover"
                />
              ) : null}
              {productImage ? <p className="text-xs text-slate-500">{productImage.name}</p> : null}
            </div>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="h-32 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
              placeholder="Description du probleme constate"
              required
            />
            <input
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
              placeholder="Email ou telephone (optionnel)"
            />

            {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-rose-600 px-4 py-3 font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le signalement'}
              </button>
              <Link
                to="/verify"
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Retour verification
              </Link>
            </div>
          </form>
        </article>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-500">Certifié par les autorités compétentes</p>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-8">
            <a href="https://industrie.gouv.cd" target="_blank" rel="noreferrer"><img src="/logos/industry.png" alt="Logo INDUSTRY" className="h-12 w-auto object-contain" /></a>
            <a href="https://occ.cd" target="_blank" rel="noreferrer"><img src="/logos/logo-occ.png" alt="Logo OCC" className="h-10 w-auto object-contain" /></a>
            <a href="https://occdcpl.cd" target="_blank" rel="noreferrer"><img src="/logos/Logo ncd.png" alt="Logo application" className="h-10 w-auto object-contain" /></a>
          </div>
          <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Votre signalement sera analyse par les equipes de controle.
          </div>
        </div>
      </footer>
    </main>
  )
}
