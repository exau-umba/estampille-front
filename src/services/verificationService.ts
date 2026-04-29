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

  async getVerificationByLabelCode(labelCode: string): Promise<ProductVerification> {
    const normalized = labelCode.trim().toUpperCase()
    if (!normalized) {
      return verificationMock
    }

    try {
      const response = await apiRequest<{ verification: ProductVerification }>(`/verify-code/${encodeURIComponent(normalized)}`)
      return response.verification
    } catch {
      return {
        ...verificationMock,
        status: 'invalid',
        subtitle: 'Code 4 caracteres invalide ou introuvable.',
      }
    }
  },

  async reportCounterfeit(payload: FormData): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/report-counterfeit', {
      method: 'POST',
      body: payload,
    })
  },
}
