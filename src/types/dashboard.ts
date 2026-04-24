export interface SidebarItem {
  label: string
  path: string
}

export interface DashboardStat {
  label: string
  value: string
  trend: string
}

export interface Company {
  id: string
  name: string
  email: string
  status: 'Actif' | 'En attente'
}

export interface Product {
  id: string
  name: string
  sku: string
  company: string
  status: 'Publié' | 'Brouillon'
}

export interface Certificate {
  id: string
  product: string
  standard: string
  validUntil: string
}

export interface QRCodeBatch {
  id: string
  productName: string
  generated: number
  createdAt: string
}
