import { apiRequest, clearAdminToken, setAdminToken } from './apiClient'

interface AuthResponse {
  data: {
    token: string
    user: {
      id: number
      name: string
      email: string
    }
  }
}

export const adminAuthService = {
  async login(email: string, password: string) {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setAdminToken(response.data.token)
    return response.data.user
  },

  async register(name: string, email: string, password: string) {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
    setAdminToken(response.data.token)
    return response.data.user
  },

  logout() {
    clearAdminToken()
  },
}
