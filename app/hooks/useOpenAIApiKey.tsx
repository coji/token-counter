import { useState } from 'react'

export const useOpenAIApiKey = () => {
  const [apiKey, setApiKey] = useState('')

  const apiKeyInput = <input className="input "></input>

  return {
    apiKeyInput,
  }
}
