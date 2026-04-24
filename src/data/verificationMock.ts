import type { ProductVerification } from '../types/verification'

export const verificationMock: ProductVerification = {
  status: 'valid',
  subtitle: 'Ce produit est authentique et certifié conforme aux exigences.',
  name: 'Huile d\'olive Premium 750ml',
  imageUrl:
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
  certificateId: 'N°0025/DCPL/2026/',
  sku: 'EST-OLI-750',
  company: 'Marsavco',
  serialNumber: 'SER-94827364',
  labelCode: 'NS6D',
  provinceCode: 'KIN',
  certificationStandard: 'ISO 22000',
  issuedAt: '2025-08-12',
  expiresAt: '2027-08-12',
  merchantWebsite: 'https://marsavco.com',
  certificateFileName: 'certificat-marsavco-2026.pdf',
}
