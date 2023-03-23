import { createCookieSessionStorage } from '@vercel/remix'

interface SessionData {
  apiKey: string
}
export const sessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET ?? 'really-secure-secret'],
    secure: process.env.NODE_ENV === 'production',
  },
})
