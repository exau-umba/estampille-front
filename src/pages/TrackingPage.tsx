import { FaLocationDot } from 'react-icons/fa6'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import icon2x from 'leaflet/dist/images/marker-icon-2x.png'
import icon from 'leaflet/dist/images/marker-icon.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'

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
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-5xl font-bold text-slate-900">Analytique de suivi</h1>
        <p className="mt-1 text-slate-600">Suivi mondial en temps réel des vérifications d'authenticité.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 xl:col-span-2">
          <p className="mb-2 inline-block rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600">Activité en direct en RDC : 1 284 scans</p>
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
            <p className="text-xs font-semibold text-rose-700">ALERTE ÉLEVÉE</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">Anomalie de vélocité</p>
            <p className="text-sm text-slate-600">ID #TR-9902 détecté entre Kinshasa et Lubumbashi en moins de 45 minutes.</p>
            <button className="mt-3 cursor-pointer rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white">Investiguer le lot</button>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold uppercase text-slate-500">Répartition géographique</h3>
            {[
              ['Kinshasa', 42],
              ['Lubumbashi', 28],
              ['Goma', 15],
            ].map(([country, value]) => (
              <div key={country} className="mt-3">
                <div className="mb-1 flex justify-between text-sm">
                  <span>{country}</span>
                  <span>{value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-brand-600" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </article>
        </div>
      </section>

      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-3xl font-semibold text-slate-900">Flux de scans en direct</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3">ID Tracking</th>
                <th className="pb-3">Produit</th>
                <th className="pb-3">Horodatage</th>
                <th className="pb-3">Localisation</th>
                <th className="pb-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['#TR-55412', 'Montre Horizon', '2 min', 'Kinshasa, Gombe', 'Vérifié'],
                ['#TR-9902', 'Sac Luxe-O', '12 min', 'Lubumbashi, Kenya', 'Alerte'],
                ['#TR-12883', 'Set Boulanger', '45 min', 'Goma, Nord-Kivu', 'Re-vérifié'],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-slate-100 text-slate-700">
                  <td className="py-3 font-medium text-brand-700">{row[0]}</td>
                  <td className="py-3">{row[1]}</td>
                  <td className="py-3 text-slate-500">{row[2]}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1">
                      <FaLocationDot className="h-3 w-3 text-slate-400" />
                      {row[3]}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      row[4] === 'Alerte'
                        ? 'bg-rose-100 text-rose-700'
                        : row[4] === 'Re-vérifié'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                    }`}>{row[4]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
