import { FaBell, FaCircleUser, FaMagnifyingGlass, FaShieldHalved } from 'react-icons/fa6'

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
      <div className="relative w-full max-w-md">
        <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Rechercher un enregistrement..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 xl:flex">
          <FaShieldHalved className="h-3.5 w-3.5" />
          Statut vérification : Entreprise vérifiée
        </div>
        <button type="button" className="cursor-pointer rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <FaBell className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600">
          <FaCircleUser className="h-4 w-4" />
          Administrateur
        </div>
      </div>
    </header>
  )
}
