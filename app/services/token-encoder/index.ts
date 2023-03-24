import type { ChatCompletionModel } from '~/types/chat-completion'
import { createGpt3EncodeEncoder } from './gpt3encode'
import { createTiktokenEncoder } from './tiktoken'

export type TokenEncoderType = 'tiktoken' | 'gpt-3-encode'

export const createTokenEncoder = (encoder: TokenEncoderType, model: ChatCompletionModel) => {
  if (encoder === 'tiktoken') {
    return createTiktokenEncoder(model)
  } else if (encoder === 'gpt-3-encode') {
    return createGpt3EncodeEncoder(model)
  } else {
    throw new Error(`unsupported encoder specified: ${encoder}`)
  }
}
