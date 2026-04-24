import type { ProductVerification } from '../types/verification'

export const verificationMock: ProductVerification = {
  status: 'valid',
  subtitle: 'Ce produit est authentique et certifié conforme aux exigences.',
  name: 'NCD Premium Olive Oil 750ml',
  imageUrl:
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
  certificateId: 'CRT-9001',
  sku: 'EST-OLI-750',
  company: 'Systeme National NCD',
  serialNumber: 'SER-94827364',
  labelCode: 'LAB-EA-2026-00421',
  provinceCode: 'QC-34',
  certificationStandard: 'ISO 22000',
  issuedAt: '2025-08-12',
  expiresAt: '2027-08-12',
  merchantWebsite: 'https://ncd.gouv.cd',
  certificateFileName: 'certificat-ncd-2026.pdf',
}
