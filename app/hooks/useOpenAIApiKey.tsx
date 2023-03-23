import { useState } from 'react'
import { AppInput } from '~/components/AppInput'

export const useOpenAIApiKey = (init = undefined) => {
  const [apiKey, setApiKey] = useState<string | undefined>(init)

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value)
  }

  const apiKeyInput = (
    <AppInput name="apiKey" label="OpenAI API Key" onChange={handleChangeInput} size="sm" direction="horizontal" />
  )

  return {
    apiKeyInput,
    apiKey,
  }
}
