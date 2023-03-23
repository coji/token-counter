import { useState } from 'react'
import { AppInput } from '~/components/AppInput'

export const useOpenAIApiKey = () => {
  const [apiKey, setApiKey] = useState('')

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
