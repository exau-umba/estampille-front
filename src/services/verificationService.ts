import { verificationMock } from '../data/verificationMock'
import { apiRequest } from './apiClient'
import type { ProductVerification } from '../types/verification'

export const verificationService = {
  async getVerificationByCode(qrCode: string): Promise<ProductVerification> {
    if (!qrCode) {
      return verificationMock
    }

    try {
      const response = await apiRequest<{ verification: ProductVerification }>(`/verify/${encodeURIComponent(qrCode)}`)
      return response.verification
    } catch {
      return {
        ...verificationMock,
        status: 'invalid',
        subtitle: 'Code invalide ou introuvable.',
      }
    }
  },
}
