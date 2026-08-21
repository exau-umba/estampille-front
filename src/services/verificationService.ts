import { verificationMock } from '../data/verificationMock'
import { apiRequest } from './apiClient'
import type { ProductVerification } from '../types/verification'

export interface DeviceLocation {
  lat: number
  lng: number
  location?: string
}

/**
  * Récupère la géolocalisation dynamique de l'appareil qui scanne pendant le chargement.
  * Possibilité 1 : GPS de l'appareil (navigator.geolocation)
  * Possibilité 2 : Géolocalisation dynamique par IP de l'appareil (ipwho.is)
  * Aucune ville ni pays par défaut/fixe dans le code.
  */
export async function getBrowserGeolocation(): Promise<DeviceLocation | null> {
  // POSSIBILITÉ 1A : GPS Satellite Haute Précision (Délai étendu à 12s)
  const gpsCoords = await new Promise<DeviceLocation | null>((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      resolve(null)
      return
    }

    let resolved = false
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true
        resolve(null)
      }
    }, 12500)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!resolved) {
          resolved = true
          clearTimeout(timer)
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        }
      },
      () => {
        // POSSIBILITÉ 1B : Si le GPS satellite échoue/décarte, secours immédiat sur le GPS Réseau/Wi-Fi du téléphone
        if (!resolved) {
          navigator.geolocation.getCurrentPosition(
            (posNet) => {
              if (!resolved) {
                resolved = true
                clearTimeout(timer)
                resolve({
                  lat: posNet.coords.latitude,
                  lng: posNet.coords.longitude,
                })
              }
            },
            () => {
              if (!resolved) {
                resolved = true
                clearTimeout(timer)
                resolve(null)
              }
            },
            { enableHighAccuracy: false, timeout: 4000, maximumAge: 600000 },
          )
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 600000 },
    )
  })

  if (gpsCoords) {
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${gpsCoords.lat}&lon=${gpsCoords.lng}&zoom=14`,
      )
      if (geoRes.ok) {
        const geoData = await geoRes.json()
        const district = geoData.address?.suburb || geoData.address?.neighbourhood || geoData.address?.quarter || ''
        const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county || ''
        const country = geoData.address?.country || ''
        const mainCity = district && city && district !== city ? `${district}, ${city}` : (city || district)
        const locParts = [mainCity, country].filter(Boolean).join(', ')
        if (locParts) {
          gpsCoords.location = locParts
        }
      }
    } catch {
      // Ignorer
    }
    return gpsCoords
  }

  // POSSIBILITÉ 2 AMÉLIORÉE : BigDataCloud Client API (Détection dynamique locale par réseau mobile du navigateur)
  try {
    const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client')
    if (res.ok) {
      const data = await res.json()
      if (data.latitude && data.longitude) {
        const city = data.locality || data.city || data.principalSubdivision || ''
        const country = data.countryName || ''
        const locParts = [city, country].filter(Boolean).join(', ')
        return {
          lat: Number(data.latitude),
          lng: Number(data.longitude),
          location: locParts || undefined,
        }
      }
    }
  } catch {
    // Secours secondaire par ipwho.is
    try {
      const res2 = await fetch('https://ipwho.is/')
      if (res2.ok) {
        const data2 = await res2.json()
        if (data2.success && data2.latitude && data2.longitude) {
          const city = data2.city || data2.region || ''
          const country = data2.country || ''
          const locParts = [city, country].filter(Boolean).join(', ')
          return {
            lat: Number(data2.latitude),
            lng: Number(data2.longitude),
            location: locParts || undefined,
          }
        }
      }
    } catch {
      // Ignorer
    }
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
