import { Navigate, Route, Routes } from 'react-router-dom'
import { CertificateAddPage } from './pages/CertificateAddPage'
import { CertificateDetailPage } from './pages/CertificateDetailPage'
import { DashboardLayout } from './layouts/DashboardLayout'
import { CertificatesPage } from './pages/CertificatesPage'
import { CompanyAddPage } from './pages/CompanyAddPage'
import { CompanyDetailPage } from './pages/CompanyDetailPage'
import { CompaniesPage } from './pages/CompaniesPage'
import { DashboardHome } from './pages/DashboardHome'
import { ProductAddPage } from './pages/ProductAddPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ProductsPage } from './pages/ProductsPage'
import { QRCodeAddPage } from './pages/QRCodeAddPage'
import { QRCodeDetailPage } from './pages/QRCodeDetailPage'
import { QRCodesPage } from './pages/QRCodesPage'
import { TrackingPage } from './pages/TrackingPage'
import { VerificationPage } from './pages/VerificationPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/verify" replace />} />
      <Route path="/verify" element={<VerificationPage />} />

      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="companies/add" element={<CompanyAddPage />} />
        <Route path="companies/:id" element={<CompanyDetailPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/add" element={<ProductAddPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="certificates/add" element={<CertificateAddPage />} />
        <Route path="certificates/:id" element={<CertificateDetailPage />} />
        <Route path="qr-codes" element={<QRCodesPage />} />
        <Route path="qr-codes/add" element={<QRCodeAddPage />} />
        <Route path="qr-codes/:id" element={<QRCodeDetailPage />} />
        <Route path="tracking" element={<TrackingPage />} />
      </Route>
    </Routes>
  )
}

export default App
