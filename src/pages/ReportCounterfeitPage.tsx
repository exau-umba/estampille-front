import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaCircleCheck, FaTriangleExclamation, FaLocationDot, FaPhone, FaArrowLeft } from 'react-icons/fa6'
import { verificationService } from '../services/verificationService'

export function ReportCounterfeitPage() {
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [contact, setContact] = useState('')
  const [productImage, setProductImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<{ location: string; contact: string; date: string } | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsSubmitting(true)
    setError('')
    try {
      const payload = new FormData()
      payload.append('location', location)
      payload.append('description', description)
      if (contact) payload.append('contact', contact)
      if (productImage) payload.append('image', productImage)

      await verificationService.reportCounterfeit(payload)

      setSubmittedData({
        location,
        contact: contact || 'Non renseigné',
        date: new Date().toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      })

      setIsSubmitted(true)
      setDescription('')
      setLocation('')
      setContact('')
      setProductImage(null)
      setImagePreview('')
    } catch (err: unknown) {
      console.error('Erreur envoi signalement:', err)
      setError('Échec de l\'envoi du signalement. Veuillez vérifier votre connexion et réinstaller l\'image si nécessaire.')
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

  function handleReset() {
    setIsSubmitted(false)
    setSubmittedData(null)
    setError('')
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
        {isSubmitted ? (
          /* PAGE DE SUCCÈS APPRÈS ENVOI DU SIGNALEMENT */
          <article className="w-full max-w-xl rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm space-y-6">
            <span className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <FaCircleCheck className="h-10 w-10" />
            </span>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">Signalement transmis avec succès !</h1>
              <p className="mt-2 text-emerald-700 font-medium">
                Merci pour votre vigilance et votre contribution citoyenne.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm space-y-2">
              <p className="font-semibold text-slate-800 border-b border-slate-200 pb-2">Récapitulatif du signalement</p>
              <div className="flex items-center gap-2 text-slate-600">
                <FaLocationDot className="h-4 w-4 text-rose-500 shrink-0" />
                <span><strong>Lieu :</strong> {submittedData?.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <FaPhone className="h-4 w-4 text-slate-400 shrink-0" />
                <span><strong>Contact :</strong> {submittedData?.contact}</span>
              </div>
              <p className="text-xs text-slate-500 pt-1">
                Enregistré le {submittedData?.date}
              </p>
            </div>

            <p className="text-xs leading-relaxed text-slate-500">
              Votre rapport a été transmis directement aux équipes de contrôle de l'Office Congolais de Contrôle (OCC) et du Ministère de l'Industrie pour analyse.
            </p>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 cursor-pointer"
              >
                <FaTriangleExclamation className="h-4 w-4" />
                Signaler un autre produit
              </button>
              <Link
                to="/verify"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <FaArrowLeft className="h-4 w-4" />
                Retour à la vérification
              </Link>
            </div>
          </article>
        ) : (
          /* FORMULAIRE DE SIGNALEMENT */
          <article className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <FaTriangleExclamation className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Signaler un faux produit</h1>
                <p className="text-sm text-slate-600">
                  Transmettez votre signalement aux autorités de contrôle.
                </p>
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-500 mb-1">
                  Lieu d'achat ou d'observation *
                </label>
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-brand-600 focus:outline-none"
                  placeholder="Ex: Marché Central, Boutique X, Kinshasa/Gombe..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-slate-500 mb-1">
                  Description du problème constaté *
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="h-32 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-brand-600 focus:outline-none"
                  placeholder="Expliquez ce qui vous semble suspect (emballage dégradé, étiquette illisible, absence de code QR, goût anormal...)"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs uppercase font-semibold text-slate-500">
                  Photo ou image du produit (Optionnel mais recommandé)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium"
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Aperçu produit signalé"
                    className="h-48 w-full rounded-xl border border-slate-200 object-cover"
                  />
                ) : null}
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-slate-500 mb-1">
                  Vos coordonnées (Optionnel)
                </label>
                <input
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-brand-600 focus:outline-none"
                  placeholder="Numéro de téléphone ou Email (si vous souhaitez être recontacté)"
                />
              </div>

              {error ? (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700 font-medium">
                  {error}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-rose-600 px-4 py-3.5 font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
                >
                  {isSubmitting ? 'Transmission en cours...' : 'Envoyer le signalement'}
                </button>
                <Link
                  to="/verify"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-3.5 font-medium text-slate-700 hover:bg-slate-50"
                >
                  Retour vérification
                </Link>
              </div>
            </form>
          </article>
        )}
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
            Votre signalement sera analysé en toute confidentialité par les équipes de contrôle de l'OCC.
          </div>
        </div>
      </footer>
    </main>
  )
}
