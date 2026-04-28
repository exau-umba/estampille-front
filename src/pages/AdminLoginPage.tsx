import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { adminAuthService } from '../services/adminAuthService'
import { getAdminToken } from '../services/apiClient'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = getAdminToken()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await adminAuthService.login(email, password)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? '/admin/dashboard')
    } catch {
      setError('Echec de connexion. Verifiez vos identifiants.')
    } finally {
      setLoading(false)
    }
  }

  if (token) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Connexion admin</h1>
      <p className="mt-1 text-slate-600">Acces a la gestion des entreprises, produits et certificats.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
          placeholder="Email admin"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
          placeholder="Mot de passe"
          required
        />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <Button type="submit" disabled={loading} fullWidth>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </main>
  )
}
