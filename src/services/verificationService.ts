import { verificationMock } from '../data/verificationMock'
import type { ProductVerification } from '../types/verification'

export const verificationService = {
  async getVerificationByCode(_qrCode: string): Promise<ProductVerification> {
    return Promise.resolve(verificationMock)
  },
}
