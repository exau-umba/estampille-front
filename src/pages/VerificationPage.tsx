import { FaArrowUpRightFromSquare, FaCircleCheck, FaCircleXmark, FaFilePdf } from 'react-icons/fa6'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CenteredLoading } from '../components/ui/CenteredLoading'
import { useVerification } from '../hooks/useVerification'
import { verificationService } from '../services/verificationService'
import type { ProductVerification } from '../types/verification'

function VerificationHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logos/logo-min-industrie.jpg" alt="Logo INDUSTRY" className="h-10 w-auto object-contain" />
          <img src="/logos/logo-occ.png" alt="Logo OCC" className="h-8 w-auto object-contain" />
          <img src="/logos/Logo ncd.png" alt="Logo application" className="h-8 w-8 rounded-md object-cover" />
        </div>
      </div>
    </header>
  )
}

function VerificationFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-500">Certifié par les autorités compétentes</p>
        <div className="mb-6 flex flex-wrap items-center justify-center gap-8">
          <a href="https://industrie.gouv.cd" target="_blank" rel="noreferrer"><img src="/logos/industry.png" alt="Logo INDUSTRY" className="h-12 w-auto object-contain" /></a>
          <a href="https://occ.cd" target="_blank" rel="noreferrer"><img src="/logos/logo-occ.png" alt="Logo OCC" className="h-10 w-auto object-contain" /></a>
          <a href="https://occdcpl.cd" target="_blank" rel="noreferrer"><img src="/logos/Logo ncd.png" alt="Logo application" className="h-10 w-auto object-contain" /></a>
        </div>
        <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Cette vérification est basée sur un identifiant cryptographique unique.
        </div>
      </div>
    </footer>
  )
}

export function VerificationPage() {
  const [searchParams] = useSearchParams()
  const qrToken = useMemo(() => searchParams.get('token') ?? '', [searchParams])
  const [labelCode, setLabelCode] = useState('')
  const [manualData, setManualData] = useState<ProductVerification | null>(null)
  const [manualError, setManualError] = useState('')
  const [manualLoading, setManualLoading] = useState(false)
  const { data, isLoading } = useVerification(qrToken)
  const resolvedData = qrToken ? data : manualData
  const resolvedLoading = qrToken ? isLoading : manualLoading

  const isExpired = useMemo(() => {
    if (!resolvedData?.expiresAt) return false
    const exp = new Date(resolvedData.expiresAt)
    return !isNaN(exp.getTime()) && exp < new Date()
  }, [resolvedData?.expiresAt])

  async function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setManualError('')
    setManualLoading(true)
    const result = await verificationService.getVerificationByLabelCode(labelCode)
    if (result.status === 'invalid') {
      setManualData(null)
      setManualError('Code 4 caracteres introuvable.')
    } else {
      setManualData(result)
    }
    setManualLoading(false)
  }

  if (!qrToken && !resolvedData) {
    return (
      <main className="min-h-screen bg-[#f5f6fb]">
        <VerificationHeader />
        <section className="mx-auto flex min-h-[calc(100vh-230px)] max-w-6xl items-center justify-center px-4 py-8 sm:px-8">
          <article className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6">
            <h1 className="text-3xl font-bold text-slate-900">Verification produit</h1>
            <p className="mt-2 text-slate-600">
              Saisissez le code de 4 caracteres visible sur votre etiquette QR.
            </p>
            <form className="mt-5 space-y-4" onSubmit={(event) => void handleManualSubmit(event)}>
              <input
                value={labelCode}
                onChange={(event) => setLabelCode(event.target.value.toUpperCase().slice(0, 4))}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-2xl font-semibold uppercase tracking-[0.35em] text-slate-900"
                placeholder="ABCD"
                maxLength={4}
                required
              />
              {manualError ? <p className="text-sm text-rose-600">{manualError}</p> : null}
              <button
                type="submit"
                disabled={manualLoading || labelCode.trim().length !== 4}
                className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {manualLoading ? 'Verification...' : 'Verifier'}
              </button>
              <Link
                to="/verify/report"
                className="inline-flex w-full items-center justify-center rounded-xl border border-rose-300 px-4 py-3 text-sm font-medium text-rose-700 hover:bg-rose-50"
              >
                Signaler un faux produit
              </Link>
            </form>
          </article>
        </section>
        <VerificationFooter />
      </main>
    )
  }

  if (resolvedLoading || !resolvedData) {
    return (
      <main className="min-h-screen bg-[#f5f6fb]">
        <CenteredLoading label="Chargement de la verification..." minHeightClassName="min-h-screen" />
      </main>
    )
  }

  if (resolvedData.status === 'invalid') {
    return (
      <main className="min-h-screen bg-[#f5f6fb]">
        <VerificationHeader />

        <section className="mx-auto flex min-h-[calc(100vh-230px)] max-w-4xl items-center justify-center px-4 py-8 sm:px-8">
          <article className="w-full max-w-xl rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm space-y-6">
            <span className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <FaCircleXmark className="h-10 w-10" />
            </span>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">Produit non certifié</h1>
              <p className="mt-2 text-base font-medium text-rose-700">{resolvedData.subtitle || 'Code invalide ou introuvable.'}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-600">
              <p className="mb-1 font-semibold text-slate-800">Que signifie cette alerte ?</p>
              <p>
                L'identifiant de ce produit n'a pas pu être authentifié. Il peut s'agir d'une étiquette contrefaite, d'un code révoqué ou non enregistré auprès de l'OCC.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                to="/verify/report"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
              >
                Signaler un faux produit
              </Link>
              <Link
                to="/verify"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Vérifier un autre code
              </Link>
            </div>
          </article>
        </section>

        <VerificationFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f6fb]">
      <VerificationHeader />

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[1.2fr_1fr] sm:px-8">
        <article className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <FaCircleCheck className="h-8 w-8" />
            </span>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">Produit certifié</h1>
            <p className="mt-1 text-emerald-700">{resolvedData.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <img src={resolvedData.imageUrl} alt={resolvedData.name} className="h-72 w-full object-cover" />
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                Authentique
              </span>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">{resolvedData.name}</h2>
              <p className="mt-2 text-slate-600">
                Ce produit fait partie de la gamme de produits de l'entreprise {resolvedData.company}.
              </p>
            </article>
          </div>
        </article>

        <article className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Spécifications</h2>
              <dl className="grid grid-cols-1 gap-3 text-sm">
                {[
                  ['ID CERTIFICAT', resolvedData.certificateId],
                  ['ID ETIQUETTE', resolvedData.labelCode],
                  ['Code province', resolvedData.provinceCode],
                  ['Norme certifiée', resolvedData.certificationStandard],
                ].map(([label, value]) => (
                  <div key={label} className="col-span-1">
                    <dt className="text-xs uppercase text-slate-500">{label}</dt>
                    <dd className="font-medium text-slate-800">{value || 'N/A'}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5">
              <div>
                <h2 className="mb-3 text-xl font-semibold text-slate-900">Statut du certificat</h2>
                <div
                  className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    isExpired ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {isExpired ? (
                    <>
                      <FaCircleXmark className="h-4 w-4" />
                      Certificat expiré
                    </>
                  ) : (
                    <>
                      <FaCircleCheck className="h-4 w-4" />
                      Certificat Valide
                    </>
                  )}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {isExpired
                    ? "Ce certificat a dépassé sa date d'expiration."
                    : 'Ce certificat est actuellement valide et conforme.'}
                </p>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>Date d'expiration : </span>
                <span className="font-semibold text-slate-800">
                  {resolvedData.expiresAt ? resolvedData.expiresAt : 'Non spécifiée'}
                </span>
              </div>
            </div>
          </div>

          {/* <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
            <FaFilePdf className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm text-slate-600">{data.certificateFileName}</p>
          </div> */}

          {/* <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 font-medium text-white hover:bg-brand-700">
            <FaQrcode className="h-4 w-4" />
            Scanner un autre produit
          </button> */}
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-600 bg-brand-600 px-4 py-3 font-medium text-white hover:bg-brand-700 cursor-pointer"
            onClick={() => window.open(`https://annuaire.occdcpl.com/#/annuaire/${resolvedData.numberCertificat || resolvedData.certificateId}`, '_blank')}
          >
            <FaFilePdf className="h-4 w-4" />
            Voir le certificat
          </button>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-3 font-medium text-emerald-700 hover:bg-emerald-100 cursor-pointer" onClick={() => window.open(`${resolvedData.merchantWebsite}`, '_blank')}>
            <FaArrowUpRightFromSquare className="h-4 w-4" />
            Site marchand
          </button>
        </article>
      </section>

      <VerificationFooter />
    </main>
  )
}
