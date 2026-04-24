import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  FaArrowRightFromBracket,
  FaBuilding,
  FaChartLine,
  FaChevronLeft,
  FaChevronRight,
  FaFileCircleCheck,
  FaGear,
  FaHouse,
  FaQrcode,
} from 'react-icons/fa6'
import { sidebarItems } from '../../data/dashboardMock'

const itemIcons: Record<string, ReactNode> = {
  'Tableau de bord': <FaHouse className="h-4 w-4" />,
  Entreprises: <FaBuilding className="h-4 w-4" />,
  Produits: <FaQrcode className="h-4 w-4" />,
  Certificats: <FaFileCircleCheck className="h-4 w-4" />,
  'Codes QR': <FaQrcode className="h-4 w-4" />,
  Suivi: <FaChartLine className="h-4 w-4" />,
  Settings: <FaGear className="h-4 w-4" />,
}

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`flex w-full flex-col border-r border-slate-200 bg-white p-4 transition-all lg:fixed lg:left-0 lg:top-0 lg:h-screen ${
        isCollapsed ? 'lg:w-24' : 'lg:w-64'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="absolute -right-3 top-6 hidden cursor-pointer rounded-full border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm hover:bg-slate-50 lg:inline-flex"
      >
        {isCollapsed ? <FaChevronRight className="h-3.5 w-3.5" /> : <FaChevronLeft className="h-3.5 w-3.5" />}
      </button>

      <div className="mb-6 border-b border-slate-100 pb-4">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <img src="/logos/Logo ncd.png" alt="Logo app" className="h-10 w-10 rounded-lg object-cover" />
          {!isCollapsed ? (
            <div>
              <p className="text-lg font-bold leading-tight text-brand-700">NCD</p>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">Plateforme institutionnelle</p>
            </div>
          ) : null}
        </div>
      </div>

      <nav className="space-y-1">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm transition ${
                isCollapsed ? 'justify-center' : 'gap-2'
              } ${
                isActive
                  ? 'bg-brand-100 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
            title={item.label}
          >
            {itemIcons[item.label]}
            {!isCollapsed ? item.label : null}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-3 pt-8">
        <div className="rounded-xl bg-slate-50 p-3">
          <button
            type="button"
            className="w-full cursor-pointer rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
            title="Générer QR"
          >
            {isCollapsed ? 'QR' : 'Générer QR'}
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3">
          {!isCollapsed ? (
            <>
              <p className="text-sm font-semibold text-slate-800">Administrateur</p>
              <p className="text-xs text-slate-500">Super admin</p>
            </>
          ) : null}
          <button
            type="button"
            className={`mt-3 inline-flex cursor-pointer items-center text-xs font-medium text-slate-500 hover:text-slate-700 ${
              isCollapsed ? 'w-full justify-center' : 'gap-2'
            }`}
            title="Se déconnecter"
          >
            <FaArrowRightFromBracket className="h-3 w-3" />
            {!isCollapsed ? 'Déconnexion' : null}
          </button>
        </div>
      </div>
    </aside>
  )
}
