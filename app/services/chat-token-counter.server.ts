import { encode as gpt3encode } from 'gpt-3-encoder'
import type { ChatCompletionRequestMessage } from 'openai'
import type { ChatCompletionModel } from '~/types/chat-completion'
import { encoding_for_model } from '@dqbd/tiktoken'

// reference: How to format inputs to ChatGPT models
// https://github.com/openai/openai-cookbook/blob/main/examples/How_to_format_inputs_to_ChatGPT_models.ipynb

// Tiktoken says ChatGPT's API, gpt-3.5-turbo, uses the cl100k_base encoder, but it appears to use p50k_base in openai #304
// https://github.com/openai/openai-python/issues/304

const tokensByModel = (
  model: ChatCompletionModel,
): {
  tokensPerMessage: number
  tokensPerName: number
} => {
  if (model === 'gpt-3.5-turbo') {
    console.log(
      'Warning: gpt-3.5-turbo may change over time. Returning num tokens assuming gpt-3.5-turbo-0301.',
    )
    return tokensByModel('gpt-3.5-turbo-0301')
  } else if (model === 'gpt-3.5-turbo-0301') {
    return {
      tokensPerMessage: 4, // every message follows <im_start>{role/name}\n{content}<im_end>\n
      tokensPerName: -1, // if there's a name, the role is omitted. role is always required and always 1 token
    }
  } else if (model === 'gpt-4') {
    return {
      tokensPerMessage: 3,
      tokensPerName: 1,
    }
  }
  throw new Error(`Unrecognized model: ${model}`)
}

export const testEstimateChatTokens = (
  model: ChatCompletionModel,
  messages: ChatCompletionRequestMessage[],
) => {
  const enc = encoding_for_model(model)
  const { tokensPerMessage, tokensPerName } = tokensByModel(model)

  let tokens = 0
  for (const message of messages) {
    tokens += tokensPerMessage
    for (const key of Object.keys(message) as (keyof typeof message)[]) {
      tokens += enc.encode(message[key] ?? '').length
      if (key === 'name') {
        tokens += tokensPerName
      }
    }
  }
  tokens += 2 // every reply is primed with <im_start>assistant

  enc.free()
  return tokens
}

export const estimateChatTokens = (
  model: ChatCompletionModel,
  messages: ChatCompletionRequestMessage[],
) => {
  const { tokensPerMessage, tokensPerName } = tokensByModel(model)

  let tokens = 0
  for (const message of messages) {
    tokens += tokensPerMessage
    for (const key of Object.keys(message) as (keyof typeof message)[]) {
      tokens += gpt3encode(message[key] ?? '').length
      if (key === 'name') {
        tokens += tokensPerName
      }
    }
  }
  tokens += 2 // every reply is primed with <im_start>assistant

  return tokens
}
