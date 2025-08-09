import { defineConfig } from '@adonisjs/shield'

export default defineConfig({
  // Protection CSRF
  csrf: {
    enabled: true,
    exceptRoutes: [],
    enableXsrfCookie: true,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  },

  // Protection contre le clickjacking
  xFrame: {
    enabled: true,
    action: 'DENY', // ou 'SAMEORIGIN'
  },

  // Content-Type Sniffing Protection
  contentTypeSniffing: {
    enabled: true,
  },

  // HTTP Strict Transport Security
  hsts: {
    enabled: true,
    maxAge: '180 days',
    includeSubDomains: true,
    preload: false,
  },

  // Content Security Policy
  csp: {
    enabled: true,
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'"],
      fontSrc: ["'self'"],
      baseUri: ["'self'"],
    },
    reportOnly: false,
  },
})
