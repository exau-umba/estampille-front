import { verificationMock } from '../data/verificationMock'
import { apiRequest } from './apiClient'
import type { ProductVerification } from '../types/verification'

export function getBrowserGeolocation(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 },
    )
  })
}

export const verificationService = {
  async getVerificationByCode(qrCode: string): Promise<ProductVerification> {
    if (!qrCode) {
      return verificationMock
    }

    const coords = await getBrowserGeolocation()
    const queryParams = coords ? `?lat=${coords.lat}&lng=${coords.lng}` : ''

    try {
      const response = await apiRequest<{ verification: ProductVerification }>(
        `/verify/${encodeURIComponent(qrCode)}${queryParams}`,
      )
      return response.verification
    } catch {
      return {
        status: 'invalid',
        subtitle: 'Code invalide ou introuvable.',
        name: '',
        imageUrl: '',
        certificateId: '',
        sku: '',
        company: '',
        serialNumber: '',
        labelCode: qrCode.slice(0, 8),
        provinceCode: '',
        certificationStandard: '',
        issuedAt: '',
        expiresAt: '',
        merchantWebsite: '',
        certificateFileName: '',
      }
    }
  },

  async getVerificationByLabelCode(labelCode: string): Promise<ProductVerification> {
    const normalized = labelCode.trim().toUpperCase()
    if (!normalized) {
      return verificationMock
    }

    const coords = await getBrowserGeolocation()
    const queryParams = coords ? `?lat=${coords.lat}&lng=${coords.lng}` : ''

    try {
      const response = await apiRequest<{ verification: ProductVerification }>(
        `/verify-code/${encodeURIComponent(normalized)}${queryParams}`,
      )
      return response.verification
    } catch {
      return {
        status: 'invalid',
        subtitle: 'Code 4 caracteres invalide ou introuvable.',
        name: '',
        imageUrl: '',
        certificateId: '',
        sku: '',
        company: '',
        serialNumber: '',
        labelCode: normalized,
        provinceCode: '',
        certificationStandard: '',
        issuedAt: '',
        expiresAt: '',
        merchantWebsite: '',
        certificateFileName: '',
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
