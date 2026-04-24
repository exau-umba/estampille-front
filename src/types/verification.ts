export type VerificationState = 'valid' | 'invalid'

export interface ProductVerification {
  status: VerificationState
  subtitle: string
  name: string
  imageUrl: string
  certificateId: string
  sku: string
  company: string
  serialNumber: string
  labelCode: string
  provinceCode: string
  certificationStandard: string
  issuedAt: string
  expiresAt: string
  merchantWebsite: string
  certificateFileName: string
}
