import { useEffect, useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import { LayersControl, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { adminCrudService, type ScanEventDto, type ScanStatsDto } from '../services/adminCrudService'
import { CenteredLoading } from '../components/ui/CenteredLoading'

const validIcon = L.divIcon({
  className: 'custom-marker-valid',
  html: `<div style="background-color: #10b981; width: 22px; height: 22px; border-radius: 50%; border: 3.5px solid #ffffff; box-shadow: 0 0 12px rgba(16,185,129,0.9);"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

const alertIcon = L.divIcon({
  className: 'custom-marker-alert',
  html: `<div style="background-color: #f43f5e; width: 26px; height: 26px; border-radius: 50%; border: 3.5px solid #ffffff; box-shadow: 0 0 14px rgba(244,63,94,1);"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
})

function MapBoundsFitter({ scans }: { scans: ScanEventDto[] }) {
  const map = useMap()

  useEffect(() => {
    const validCoords = scans
      .filter((s) => s.latitude !== null && s.latitude !== undefined && s.longitude !== null && s.longitude !== undefined)
      .map((s) => [s.latitude!, s.longitude!] as [number, number])

    if (validCoords.length > 0) {
      if (validCoords.length === 1) {
        map.setView(validCoords[0], 10)
      } else {
        const bounds = L.latLngBounds(validCoords)
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
      }
    }
  }, [scans, map])

  return null
}

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
        setScans(scansRes.data || [])
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
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="inline-block rounded-lg bg-slate-900 text-white px-3 py-1 text-xs font-semibold">
              🛰️ Carte Mondiale de Suivi GPS des Scans (Temps Réel)
            </p>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Conforme
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-rose-700">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span> Alerte / Anomalie
              </span>
            </div>
          </div>
          <div className="h-[450px] overflow-hidden rounded-xl border border-slate-300 shadow-inner">
            <MapContainer center={[0, 20]} zoom={3} minZoom={2} maxZoom={20} scrollWheelZoom className="h-full w-full">
              <MapBoundsFitter scans={scans} />
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Google Hybride (Satellite + Avenues)">
                  <TileLayer
                    attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                    url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    maxZoom={20}
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Google Plan (Rues & Avenues)">
                  <TileLayer
                    attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                    url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    maxZoom={20}
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="OpenStreetMap Standard">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png"
                    maxZoom={19}
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Esri Satellite Pur">
                  <TileLayer
                    attribution='Tiles &copy; Esri'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                  />
                </LayersControl.BaseLayer>
              </LayersControl>
              {scans.map((scan) => {
                const lat = scan.latitude ?? -4.3224
                const lng = scan.longitude ?? 15.3070
                const isValid = scan.result === 'valid'
                const icon = isValid ? validIcon : alertIcon

                return (
                  <Marker key={scan.id} position={[lat, lng]} icon={icon}>
                    <Popup>
                      <div className="p-1 space-y-1 text-xs">
                        <p className="font-bold text-sm text-slate-900">{scan.product_name}</p>
                        <p className="text-slate-600">Code: <span className="font-mono font-medium text-brand-700">{scan.code}</span></p>
                        <p className="text-slate-600">Lieu: {scan.location}</p>
                        <p className="pt-1">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 font-semibold text-[11px] ${
                              isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isValid ? '🟢 Scan Conforme' : '🔴 Alerte / Anomalie'}
                          </span>
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
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

