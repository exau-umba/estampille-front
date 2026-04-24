import type {
  Certificate,
  Company,
  DashboardStat,
  Product,
  QRCodeBatch,
  SidebarItem,
} from '../types/dashboard'

export const sidebarItems: SidebarItem[] = [
  { label: 'Tableau de bord', path: '/admin/dashboard' },
  { label: 'Entreprises', path: '/admin/companies' },
  { label: 'Produits', path: '/admin/products' },
  { label: 'Certificats', path: '/admin/certificates' },
  { label: 'Codes QR', path: '/admin/qr-codes' },
  { label: 'Suivi', path: '/admin/tracking' },
]

export const dashboardStats: DashboardStat[] = [
  { label: 'Produits vérifiés', value: '12 480', trend: '+12.5%' },
  { label: 'Certificats actifs', value: '3 244', trend: '+4.2%' },
  { label: 'QR générés', value: '54 901', trend: '+18.1%' },
  { label: 'Taux d’authenticité', value: '98.7%', trend: '+0.4%' },
]

export const companiesMock: Company[] = [
  { id: 'CMP-001', name: 'Systeme National NCD', email: 'ops@ncd.cd', status: 'Actif' },
  { id: 'CMP-002', name: 'VeriGoods Inc.', email: 'hello@verigoods.io', status: 'Actif' },
  { id: 'CMP-003', name: 'NorthCert Group', email: 'admin@northcert.ca', status: 'En attente' },
]

export const productsMock: Product[] = [
  { id: 'PRD-101', name: 'Olive Oil Premium', sku: 'EST-OLI-750', company: 'Systeme National NCD', status: 'Publié' },
  { id: 'PRD-102', name: 'Argan Hair Care', sku: 'VER-ARG-120', company: 'VeriGoods Inc.', status: 'Publié' },
  { id: 'PRD-103', name: 'Organic Honey', sku: 'NOR-HON-600', company: 'NorthCert Group', status: 'Brouillon' },
]

export const certificatesMock: Certificate[] = [
  { id: 'CRT-9001', product: 'Olive Oil Premium', standard: 'ISO 22000', validUntil: '2027-08-12' },
  { id: 'CRT-9002', product: 'Argan Hair Care', standard: 'HACCP', validUntil: '2026-11-01' },
  { id: 'CRT-9003', product: 'Organic Honey', standard: 'BIO EU', validUntil: '2026-05-10' },
]

export const qrBatchesMock: QRCodeBatch[] = [
  { id: 'QR-B-01', productName: 'Olive Oil Premium', generated: 5000, createdAt: '2026-04-20' },
  { id: 'QR-B-02', productName: 'Argan Hair Care', generated: 2500, createdAt: '2026-04-18' },
]
