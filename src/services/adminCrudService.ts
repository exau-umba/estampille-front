import { apiRequest } from './apiClient'

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

export interface CompanyDto {
  id: string
  name: string
  registration_number?: string
  email?: string
  phone?: string
  website?: string
  country?: string
  province?: string
  province_code?: string
  address?: string
  status: string
}

export interface ProductDto {
  id: string
  name: string
  description?: string
  company_id?: string
  sku: string
  image_url?: string
  status: string
  company?: { name: string }
}

export interface CertificateDto {
  id: string
  product_id?: string
  certificate_number: string
  standard?: string
  issued_at?: string
  expires_at?: string
  file_name?: string
  file_url?: string
  product?: { name: string }
}

export interface BatchDto {
  id: string
  product_name: string
  quantity: number
  total_generated: number
  status: string
  created_at: string
  company?: { id: string; name: string }
  product?: { id: string; name: string; sku: string }
  certificate?: { id: string; certificate_number: string; standard?: string; expires_at?: string }
}

export interface BatchCodeDto {
  id: string
  serial: number
  code: string
  status: string
  expires_at?: string | null
  revoked_at?: string | null
  revocation_reason?: string | null
  verification_token: string
  verification_url: string
}

export const adminCrudService = {
  listCompanies(page: number, perPage: number) {
    return apiRequest<PaginatedResponse<CompanyDto>>(`/companies?page=${page}&per_page=${perPage}`, {
      authenticated: true,
    })
  },

  createCompany(payload: Record<string, unknown>) {
    return apiRequest<{ data: CompanyDto }>('/companies', {
      method: 'POST',
      authenticated: true,
      body: JSON.stringify(payload),
    })
  },

  deleteCompany(id: string) {
    return apiRequest<{ message: string }>(`/companies/${id}`, {
      method: 'DELETE',
      authenticated: true,
    })
  },

  updateCompany(id: string, payload: Record<string, unknown>) {
    return apiRequest<{ data: CompanyDto }>(`/companies/${id}`, {
      method: 'PUT',
      authenticated: true,
      body: JSON.stringify(payload),
    })
  },

  listProducts(page: number, perPage: number) {
    return apiRequest<PaginatedResponse<ProductDto>>(`/products?page=${page}&per_page=${perPage}`, {
      authenticated: true,
    })
  },

  getProduct(id: string) {
    return apiRequest<{ data: ProductDto }>(`/products/${id}`, { authenticated: true })
  },

  createProduct(payload: Record<string, unknown> | FormData) {
    return apiRequest<{ data: ProductDto }>('/products', {
      method: 'POST',
      authenticated: true,
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
    })
  },

  updateProduct(id: string, payload: Record<string, unknown> | FormData) {
    const body =
      payload instanceof FormData
        ? (() => {
            const formData = new FormData()
            payload.forEach((value, key) => formData.append(key, value))
            formData.append('_method', 'PUT')
            return formData
          })()
        : JSON.stringify(payload)

    return apiRequest<{ data: ProductDto }>(`/products/${id}`, {
      method: 'POST',
      authenticated: true,
      body,
      headers: payload instanceof FormData ? undefined : { 'X-HTTP-Method-Override': 'PUT' },
    })
  },

  deleteProduct(id: string) {
    return apiRequest<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
      authenticated: true,
    })
  },

  listCertificates(page: number, perPage: number) {
    return apiRequest<PaginatedResponse<CertificateDto>>(`/certificates?page=${page}&per_page=${perPage}`, {
      authenticated: true,
    })
  },

  getCertificate(id: string) {
    return apiRequest<{ data: CertificateDto }>(`/certificates/${id}`, { authenticated: true })
  },

  createCertificate(payload: Record<string, unknown>) {
    return apiRequest<{ data: CertificateDto }>('/certificates', {
      method: 'POST',
      authenticated: true,
      body: JSON.stringify(payload),
    })
  },

  updateCertificate(id: string, payload: Record<string, unknown>) {
    return apiRequest<{ data: CertificateDto }>(`/certificates/${id}`, {
      method: 'PUT',
      authenticated: true,
      body: JSON.stringify(payload),
    })
  },

  deleteCertificate(id: string) {
    return apiRequest<{ message: string }>(`/certificates/${id}`, {
      method: 'DELETE',
      authenticated: true,
    })
  },

  listBatches(page: number, perPage: number) {
    return apiRequest<PaginatedResponse<BatchDto>>(`/qr-batches?page=${page}&per_page=${perPage}`, {
      authenticated: true,
    })
  },

  getBatch(id: string) {
    return apiRequest<{ data: BatchDto }>(`/qr-batches/${id}`, { authenticated: true })
  },

  listBatchCodes(batchId: string, page: number, perPage: number) {
    return apiRequest<{ data: BatchCodeDto[]; meta: PaginatedResponse<BatchCodeDto>['meta'] }>(
      `/qr-batches/${batchId}/codes?page=${page}&per_page=${perPage}`,
      { authenticated: true },
    )
  },

  createBatch(payload: Record<string, unknown>) {
    return apiRequest<{ data: BatchDto; message: string }>('/qr-batches', {
      method: 'POST',
      authenticated: true,
      body: JSON.stringify(payload),
    })
  },

  updateBatch(id: string, payload: Record<string, unknown>) {
    return apiRequest<{ data: BatchDto }>(`/qr-batches/${id}`, {
      method: 'PUT',
      authenticated: true,
      body: JSON.stringify(payload),
    })
  },

  deleteBatch(id: string) {
    return apiRequest<{ message: string }>(`/qr-batches/${id}`, {
      method: 'DELETE',
      authenticated: true,
    })
  },

  getCompany(id: string) {
    return apiRequest<{ data: CompanyDto }>(`/companies/${id}`, { authenticated: true })
  },
}
