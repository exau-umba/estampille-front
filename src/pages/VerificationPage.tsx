import { FaArrowUpRightFromSquare, FaCircleCheck, FaFilePdf } from 'react-icons/fa6'
import { useVerification } from '../hooks/useVerification'

export function VerificationPage() {
  const { data, isLoading } = useVerification('mock-qr-code')

  if (isLoading || !data) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-sm text-slate-500">Chargement de la verification...</p>
      </main>
    )
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
        {/* <p className="text-lg font-semibold text-brand-700">NCD</p> */}
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[1.2fr_1fr] sm:px-8">
        <article className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <FaCircleCheck className="h-8 w-8" />
            </span>
            <h1 className="mt-3 text-5xl font-bold text-slate-900">Produit certifié</h1>
            <p className="mt-1 text-emerald-700">{data.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <img src={data.imageUrl} alt={data.name} className="h-72 w-full object-cover" />
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                Authentique
              </span>
              <h2 className="mt-3 text-4xl font-semibold text-slate-900">{data.name}</h2>
              <p className="mt-2 text-slate-600">
                Ce produit fait partie de la collection limitee du Systeme National NCD.
              </p>
            </article>
          </div>
        </article>

        <article className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-2xl font-semibold text-slate-900">Spécifications techniques</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['ID CERTIFICAT', data.certificateId],
                ['ID ETIQUETTE', data.labelCode],
                // ['Produit', data.name],
                // ['Entreprise', data.company],
                ['Code province', data.provinceCode],
                ['Norme certifiée', data.certificationStandard],
                // ['Date de fab.', data.issuedAt],
                // ['Date d’expiration', data.expiresAt],
              ].map(([label, value]) => (
                <div key={label} className="col-span-1">
                  <dt className="text-xs uppercase text-slate-500">{label}</dt>
                  <dd className="font-medium text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-600 bg-brand-600 px-4 py-3 font-medium text-white hover:bg-brand-700"
            onClick={() => window.open(`https://annuaire.occdcpl.com/#/annuaire/${data.certificateId}`, '_blank')}
          >
            <FaFilePdf className="h-4 w-4" />
            Voir le certificat
          </button>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-3 font-medium text-emerald-700 hover:bg-emerald-100" onClick={() => window.open(`https://www.ncd.gouv.cd`, '_blank')}>
            <FaArrowUpRightFromSquare className="h-4 w-4" />
            Site marchand
          </button>
        </article>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-500">Certifié par les autorités compétentes</p>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-8">
            <img src="/logos/industry.png" alt="Logo INDUSTRY" className="h-15 w-auto object-contain" />
            <img src="/logos/logo-occ.png" alt="Logo OCC" className="h-10 w-auto object-contain" />
            <img src="/logos/Logo ncd.png" alt="Logo application" className="h-10 w-auto object-contain" />
            {/* <span className="text-sm font-semibold text-slate-500">ISO-22000</span> */}
          </div>
          <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Cette vérification est basée sur un identifiant cryptographique unique.
          </div>
        </div>
      </footer>
    </main>
  )
}
