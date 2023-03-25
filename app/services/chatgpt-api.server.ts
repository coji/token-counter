import type { ChatCompletionRequestMessage, ChatCompletionResponseMessage, CreateChatCompletionRequest } from 'openai'
import type { ChatCompletionModel } from '~/types/chat-completion'
export type { ChatCompletionRequestMessage, ChatCompletionResponseMessage }

export const chatCompletion = async (
  model: ChatCompletionModel,
  messages: ChatCompletionRequestMessage[],
  apiKey: string | undefined,
): Promise<ChatCompletionResponseMessage> => {
  if (process.env.NODE_ENV === 'development' && !apiKey) {
    return Promise.resolve({
      role: 'assistant',
      content: 'Here is a ChatGPT API Response!',
    })
  }

  const request: CreateChatCompletionRequest = {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    top_p: 1,
    n: 1,
    messages,
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(request),
  })
  return (await response.json()) as ChatCompletionResponseMessage
}
