import { useFetcher } from '@remix-run/react'
import { json, type ActionArgs } from '@vercel/remix'
import { useState } from 'react'
import { z } from 'zod'
import { AppInput } from '~/components/AppInput'
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

export const useOpenAIApiKey = (init: string | undefined = undefined) => {
  const [apiKey, setApiKey] = useState<string | undefined>(init)
  const fetcher = useFetcher()

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value)
    fetcher.submit({ apiKey: e.target.value }, { action: '/api/save-api-key', method: 'post' })
  }

  const apiKeyInput = (
    <AppInput
      name="apiKey"
      label="OpenAI API Key"
      defaultValue={init}
      onChange={handleChangeInput}
      size="xs"
      direction="horizontal"
    />
  )

  return {
    apiKeyInput,
    apiKey,
  }
}
