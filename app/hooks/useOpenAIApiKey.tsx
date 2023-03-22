import { useState } from 'react'
import { AppInput } from '~/components/AppInput'

export const useOpenAIApiKey = () => {
  const [apiKey, setApiKey] = useState('')

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value)
  }

  const apiKeyInput = (
    <div className="form-control flex flex-row gap-2">
      <label className="label" htmlFor="apiKey">
        <span className="label-text">OpenAI API Key</span>
      </label>
      <input
        id="apiKey"
        name="apiKey"
        className="input input-bordered w-full input-sm flex-1"
        type="password"
      ></input>
      {apiKey}
    </div>
  )

  return {
    apiKeyInput,
  }
}
