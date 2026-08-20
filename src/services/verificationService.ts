import { verificationMock } from '../data/verificationMock'
import { apiRequest } from './apiClient'
import type { ProductVerification } from '../types/verification'

export interface DeviceLocation {
  lat: number
  lng: number
  location?: string
}

export async function getBrowserGeolocation(): Promise<DeviceLocation | null> {
  // 1. Essayer le GPS natif du navigateur
  const gpsCoords = await new Promise<DeviceLocation | null>((resolve) => {
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
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    )
  })

  if (gpsCoords) {
    return gpsCoords
  }

  // 2. Si GPS bloqué/dépassé, secours par géolocalisation IP
  try {
    const res = await fetch('https://ipapi.co/json/')
    if (res.ok) {
      const data = await res.json()
      if (data.latitude && data.longitude) {
        const city = data.city || data.region || ''
        const country = data.country_name || 'RDC'
        return {
          lat: Number(data.latitude),
          lng: Number(data.longitude),
          location: city ? `${city}, ${country}` : country,
        }
      }
    }
  } catch {
    // Si l'API IP échoue, continuer sans blocage
  }

  return null
}

export const verificationService = {
  async getVerificationByCode(qrCode: string): Promise<ProductVerification> {
    if (!qrCode) {
      return verificationMock
    }

    const coords = await getBrowserGeolocation()
    let queryParams = ''
    if (coords) {
      const params = new URLSearchParams()
      params.set('lat', coords.lat.toString())
      params.set('lng', coords.lng.toString())
      if (coords.location) params.set('location', coords.location)
      queryParams = `?${params.toString()}`
    }

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
    let queryParams = ''
    if (coords) {
      const params = new URLSearchParams()
      params.set('lat', coords.lat.toString())
      params.set('lng', coords.lng.toString())
      if (coords.location) params.set('location', coords.location)
      queryParams = `?${params.toString()}`
    }

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
