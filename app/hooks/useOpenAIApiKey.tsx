import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import { AppInput } from '~/components/AppInput'

export const useOpenAIApiKey = (init: string | undefined = undefined) => {
  const [apiKey, setApiKey] = useState<string | undefined>(init)
  const fetcher = useFetcher()

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value)
    fetcher.submit(
      {
        apiKey: e.target.value,
      },
      {
        action: '/api/save-api-key',
        method: 'post',
      },
    )
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
