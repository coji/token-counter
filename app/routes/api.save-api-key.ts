import { json, type ActionArgs } from '@vercel/remix'
import { z } from 'zod'
import { sessionStorage } from '~/services/session.server'

const schema = z.object({
  apiKey: z.string(),
})

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const { apiKey } = schema.parse(Object.fromEntries(formData.entries()))

  const session = await sessionStorage.getSession(request.headers.get('Cookie'))
  session.set('apiKey', apiKey)
  return json({}, { headers: { 'Set-Cookie': await sessionStorage.commitSession(session) } })
}
