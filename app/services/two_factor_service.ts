import * as TwoFactor from 'node-2fa'
import QrCode from 'qrcode'

export default class TwoFactorAuthService {
  generateSecret(username: string, email: string) {
    return TwoFactor.generateSecret({
      name: 'myStudiz@' + username,
      account: email,
    })
  }

  async generateQrCode(uri: string): Promise<String> {
    return QrCode.toDataURL(uri, { color: { dark: '#d37211', light: '#F9FAFB' } })
  }

  verifyToken(secret: string, token: string): boolean {
    return !!TwoFactor.verifyToken(secret, token)
  }
}
