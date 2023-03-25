import type { ChatCompletionModel } from '~/types/chat-completion'
import { createGpt3EncodeEncoder } from './gpt-3-encoder'
import { createTiktokenEncoder } from './tiktoken'

export type TokenEncoderType = 'tiktoken' | 'gpt-3-encoder'

export const createTokenEncoder = (encoder: TokenEncoderType, model: ChatCompletionModel) => {
  if (encoder === 'tiktoken') {
    return createTiktokenEncoder(model)
  } else if (encoder === 'gpt-3-encoder') {
    return createGpt3EncodeEncoder(model)
  } else {
    throw new Error(`unsupported encoder specified: ${encoder}`)
  }
}
