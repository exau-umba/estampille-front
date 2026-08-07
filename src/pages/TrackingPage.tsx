import { useEffect, useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import icon2x from 'leaflet/dist/images/marker-icon-2x.png'
import icon from 'leaflet/dist/images/marker-icon.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'
import { adminCrudService, type ScanEventDto, type ScanStatsDto } from '../services/adminCrudService'
import { CenteredLoading } from '../components/ui/CenteredLoading'

const defaultIcon = L.icon({
  iconRetinaUrl: icon2x,
  iconUrl: icon,
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const scanPoints = [
  { label: 'Kinshasa, RDC', coords: [-4.4419, 15.2663] as [number, number] },
  { label: 'Lubumbashi, RDC', coords: [-11.6647, 27.4794] as [number, number] },
  { label: 'Goma, RDC', coords: [-1.6708, 29.2384] as [number, number] },
  { label: 'Mbuji-Mayi, RDC', coords: [-6.136, 23.59] as [number, number] },
  { label: 'Kisangani, RDC', coords: [0.5153, 25.1911] as [number, number] },
  { label: 'Bukavu, RDC', coords: [-2.5099, 28.8428] as [number, number] },
]

export function TrackingPage() {
  const [scans, setScans] = useState<ScanEventDto[]>([])
  const [stats, setStats] = useState<ScanStatsDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [scansRes, statsRes] = await Promise.all([
          adminCrudService.listScanEvents(1, 50),
          adminCrudService.getScanStats(),
        ])
        setScans(scansRes.data)
        setStats(statsRes.data)
      } catch (err) {
        console.error('Erreur chargement des scans', err)
      } finally {
        setIsLoading(false)
      }
    }
    void loadData()
  }, [])

  if (isLoading) {
    return <CenteredLoading label="Chargement du suivi des scans en direct..." minHeightClassName="min-h-[320px]" />
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-5xl font-bold text-slate-900">Analytique de suivi</h1>
        <p className="mt-1 text-slate-600">Suivi en temps réel des vérifications d'authenticité et des scans QR code.</p>
      </header>

      {/* Cartes de statistiques en direct */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase font-semibold text-slate-500">Total Scans</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">{stats?.total_scans ?? 0}</p>
          <p className="mt-1 text-xs text-slate-500">Scans enregistrés en base</p>
        </article>

        <article className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
          <p className="text-xs uppercase font-semibold text-emerald-700">Scans Conformes</p>
          <p className="mt-2 text-4xl font-bold text-emerald-800">{stats?.valid_scans ?? 0}</p>
          <p className="mt-1 text-xs text-emerald-600">Produits authentiques vérifiés</p>
        </article>

        <article className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
          <p className="text-xs uppercase font-semibold text-rose-700">Alertes & Anomalies</p>
          <p className="mt-2 text-4xl font-bold text-rose-800">{stats?.alert_scans ?? 0}</p>
          <p className="mt-1 text-xs text-rose-600">Expirés, révoqués ou introuvables</p>
        </article>

        <article className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
          <p className="text-xs uppercase font-semibold text-blue-700">Scans Aujourd'hui</p>
          <p className="mt-2 text-4xl font-bold text-blue-800">{stats?.today_scans ?? 0}</p>
          <p className="mt-1 text-xs text-blue-600">Vérifications dans les 24h</p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 xl:col-span-2">
          <p className="mb-2 inline-block rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            Cartographie des vérifications RDC
          </p>
          <div className="h-[420px] overflow-hidden rounded-xl border border-slate-200">
            <MapContainer center={[-2.9, 23.6]} zoom={6} minZoom={5} maxZoom={18} scrollWheelZoom className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              />
              {scanPoints.map((point) => (
                <Marker key={point.label} position={point.coords} icon={defaultIcon}>
                  <Popup>{point.label}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </article>

        <div className="space-y-4">
          <article className="rounded-2xl border border-rose-200 bg-white p-4">
            <p className="text-xs font-semibold text-rose-700">ALERTES SYSTÈME</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">Anomalies de scans</p>
            <p className="text-sm text-slate-600 mt-1">
              {stats?.alert_scans && stats.alert_scans > 0
                ? `${stats.alert_scans} tentative(s) de scan suspecte(s) détectée(s) dans le système.`
                : 'Aucune anomalie critique signalée pour le moment.'}
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold uppercase text-slate-500">Répartition par statut</h3>
            {[
              ['Scans Valides', stats?.total_scans ? Math.round(((stats.valid_scans ?? 0) / stats.total_scans) * 100) : 0, 'bg-emerald-600'],
              ['Alertes / Faux', stats?.total_scans ? Math.round(((stats.alert_scans ?? 0) / stats.total_scans) * 100) : 0, 'bg-rose-600'],
            ].map(([label, value, colorClass]) => (
              <div key={label as string} className="mt-3">
                <div className="mb-1 flex justify-between text-sm">
                  <span>{label}</span>
                  <span className="font-semibold">{value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className={`h-2 rounded-full ${colorClass as string}`} style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </article>
        </div>
      </section>

      {/* Tableau du flux des scans en direct */}
      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-3xl font-semibold text-slate-900">Journal des scans en direct</h2>
        {scans.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">Aucun scan enregistré pour le moment dans la base de données.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-3">Code / ID</th>
                  <th className="pb-3">Produit</th>
                  <th className="pb-3">Entreprise</th>
                  <th className="pb-3">Horodatage</th>
                  <th className="pb-3">Localisation</th>
                  <th className="pb-3">Résultat</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((scan) => {
                  const isVal = scan.result === 'valid'
                  const isExp = scan.result === 'expired'
                  const isRev = scan.result === 'revoked'
                  const isNotFound = scan.result === 'not_found'

                  const badgeClass = isVal
                    ? 'bg-emerald-100 text-emerald-700'
                    : isExp
                    ? 'bg-amber-100 text-amber-700'
                    : isRev || isNotFound
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-slate-100 text-slate-700'

                  const statusLabel = isVal
                    ? 'Authentique'
                    : isExp
                    ? 'Expiré'
                    : isRev
                    ? 'Révoqué'
                    : isNotFound
                    ? 'Introuvable'
                    : scan.result

                  const formattedDate = scan.scanned_at
                    ? new Date(scan.scanned_at).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'

                  return (
                    <tr key={scan.id} className="border-t border-slate-100 text-slate-700 hover:bg-slate-50">
                      <td className="py-3 font-mono font-medium text-brand-700">
                        {scan.code !== '-' ? scan.code : scan.id.substring(0, 8)}
                        {scan.serial ? ` (#${scan.serial})` : ''}
                      </td>
                      <td className="py-3 font-medium text-slate-900">{scan.product_name}</td>
                      <td className="py-3 text-slate-600">{scan.company_name}</td>
                      <td className="py-3 text-xs text-slate-500">{formattedDate}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                          <FaLocationDot className="h-3 w-3 text-slate-400" />
                          {scan.location}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass}`}>
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  )
}

