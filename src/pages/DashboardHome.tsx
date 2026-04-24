import { StatCard } from '../components/ui/StatCard'
import { dashboardStats } from '../data/dashboardMock'
import { FaLocationDot } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

export function DashboardHome() {
  const scans = [42, 55, 80, 48, 96, 62, 40, 45, 88, 66, 52, 74, 49, 93]

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Vue globale du système</h1>
        <p className="mt-1 text-slate-600">Analytique d'authentification en temps réel et gestion des entités.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} trend={stat.trend} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Scans par jour</h2>
            <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-600">30 derniers jours</span>
          </div>
          <div className="flex h-56 items-end gap-2">
            {scans.map((value, index) => (
              <div
                key={value + index}
                className={`flex-1 rounded-t-md ${index % 5 === 0 ? 'bg-brand-600' : 'bg-slate-200'}`}
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
        </article>

        <div className="space-y-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">Alertes critiques</h3>
            <div className="space-y-2">
              <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                <p className="font-semibold">QR dupliqué scanné</p>
                <p>ID #TR-9921 - Berlin, DE</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                <p className="font-semibold">Incohérence métadonnées</p>
                <p>ID #TR-8812 - Paris, FR</p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl bg-brand-700 p-5 text-white">
            <p className="text-xs uppercase tracking-wider text-blue-100">Santé globale</p>
            <p className="mt-1 text-2xl font-semibold">Système opérationnel</p>
            <p className="mt-2 text-sm text-blue-100">Les 12 nœuds répondent</p>
          </article>
        </div>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Derniers scans</h2>
          <Link to="/admin/qr-codes" className="text-sm font-medium text-brand-700 hover:underline">
            Voir tout
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3">Code</th>
                <th className="pb-3">Produit</th>
                <th className="pb-3">Statut</th>
                <th className="pb-3">Lieu</th>
                <th className="pb-3">Heure</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {[
                ['#TR-QR-49021', 'Heritage Chronograph', 'Vérifié', 'Londres, UK', '2 min'],
                ['#TR-QR-49022', 'Organic Arabica Coffee', 'Vérifié', 'Tokyo, JP', '12 min'],
                ['#TR-QR-49023', 'Luxe Leather Handbag', 'Alerte', 'Moscou, RU', '25 min'],
                ['#TR-QR-49024', 'Premium Gin Batch #09', 'Vérifié', 'Madrid, ES', '1 heure'],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-slate-100">
                  <td className="py-3 font-medium text-brand-700">{row[0]}</td>
                  <td className="py-3">{row[1]}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        row[2] === 'Alerte' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {row[2]}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1">
                      <FaLocationDot className="h-3 w-3 text-slate-400" />
                      {row[3]}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
