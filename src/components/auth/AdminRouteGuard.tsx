import { Navigate, useLocation } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import { getAdminToken } from '../../services/apiClient'

export function AdminRouteGuard({ children }: PropsWithChildren) {
  const location = useLocation()
  const token = getAdminToken()

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return children
}
