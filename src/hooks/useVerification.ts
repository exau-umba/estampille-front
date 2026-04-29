import { useEffect, useState } from 'react'
import { verificationService } from '../services/verificationService'
import type { ProductVerification } from '../types/verification'

interface UseVerificationResult {
  data: ProductVerification | null
  isLoading: boolean
}

export function useVerification(qrCode: string): UseVerificationResult {
  const [data, setData] = useState<ProductVerification | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchVerification() {
      if (!qrCode) {
        if (isMounted) {
          setData(null)
          setIsLoading(false)
        }
        return
      }

      setIsLoading(true)
      const result = await verificationService.getVerificationByCode(qrCode)

      if (isMounted) {
        setData(result)
        setIsLoading(false)
      }
    }

    fetchVerification()

    return () => {
      isMounted = false
    }
  }, [qrCode])

  return { data, isLoading }
}
