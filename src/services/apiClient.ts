const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080/api/v1'
const ADMIN_TOKEN_KEY = 'estampille_admin_token'

interface ApiRequestOptions extends RequestInit {
  authenticated?: boolean
}

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { authenticated = false, headers, ...rest } = options
  const token = getAdminToken()
  const finalHeaders = new Headers(headers ?? {})

  const isFormData = typeof FormData !== 'undefined' && rest.body instanceof FormData

  if (!finalHeaders.has('Accept')) {
    finalHeaders.set('Accept', 'application/json')
  }

  if (!finalHeaders.has('Content-Type') && rest.body && !isFormData) {
    finalHeaders.set('Content-Type', 'application/json')
  }

  if (authenticated && token) {
    finalHeaders.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Erreur API ${response.status}`)
  }

  return (await response.json()) as T
}
