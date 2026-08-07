import { useEffect, useState } from 'react'
import { FaLocationDot, FaPhone, FaTriangleExclamation, FaXmark, FaEye, FaClock } from 'react-icons/fa6'
import { adminCrudService, type CounterfeitReportDto } from '../services/adminCrudService'
import { CenteredLoading } from '../components/ui/CenteredLoading'

export function ReportsPage() {
  const [reports, setReports] = useState<CounterfeitReportDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    async function loadReports() {
      setIsLoading(true)
      try {
        const response = await adminCrudService.listCounterfeitReports(page, 15)
        setReports(response.data || [])
        setTotalPages(response.meta?.last_page || 1)
      } catch (err) {
        console.error('Erreur chargement des signalements', err)
      } finally {
        setIsLoading(false)
      }
    }
    void loadReports()
  }, [page])

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
            <FaTriangleExclamation className="text-amber-500 h-8 w-8" />
            Signalements de contrefaçons
          </h1>
          <p className="mt-1 text-slate-600">
            Retours et alertes émis par le grand public via le formulaire de signalement produit.
          </p>
        </div>
      </header>

      {isLoading ? (
        <CenteredLoading label="Chargement des signalements..." minHeightClassName="min-h-[300px]" />
      ) : reports.length === 0 ? (
        <article className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <FaTriangleExclamation className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Aucun signalement enregistré</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Les citoyens n'ont soumis aucun signalement de produit non certifié ou d'étiquette suspecte pour le moment.
          </p>
        </article>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reports.map((report) => {
              const formattedDate = report.reported_at
                ? new Date(report.reported_at).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-'

              return (
                <article
                  key={report.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="space-y-3">
                    {/* Header carte */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                        <FaTriangleExclamation className="h-3 w-3" />
                        Signalement #{report.id.substring(0, 8)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <FaClock className="h-3 w-3 text-slate-400" />
                        {formattedDate}
                      </span>
                    </div>

                    {/* Aperçu image si disponible */}
                    {report.image_url ? (
                      <div
                        className="group relative h-44 w-full overflow-hidden rounded-xl bg-slate-100 cursor-pointer"
                        onClick={() => setSelectedImage(report.image_url)}
                      >
                        <img
                          src={report.image_url}
                          alt="Photo du signalement"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="inline-flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-900 shadow">
                            <FaEye className="h-3.5 w-3.5" /> Agrandir
                          </span>
                        </div>
                      </div>
                    ) : null}

                    {/* Contenu & Description */}
                    <div>
                      <p className="text-xs uppercase font-semibold text-slate-400">Lieu du produit suspect</p>
                      <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <FaLocationDot className="h-3.5 w-3.5 text-rose-500" />
                        {report.location}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase font-semibold text-slate-400">Description du citoyen</p>
                      <p className="mt-1 text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100 line-clamp-4">
                        {report.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer contact */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <FaPhone className="h-3 w-3 text-slate-400" />
                      {report.contact || 'Non spécifié'}
                    </span>
                    <span className="rounded-md bg-amber-50 text-amber-700 font-semibold px-2 py-0.5">
                      En attente
                    </span>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 disabled:opacity-50"
              >
                Précédent
              </button>
              <span className="text-sm text-slate-600">
                Page {page} sur {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          ) : null}
        </>
      )}

      {/* Modal d'agrandissement d'image */}
      {selectedImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-slate-900/70 p-2 text-white hover:bg-slate-900"
            >
              <FaXmark className="h-5 w-5" />
            </button>
            <img src={selectedImage} alt="Signalement produit" className="max-h-[80vh] w-full object-contain rounded-xl" />
          </div>
        </div>
      ) : null}
    </section>
  )
}
