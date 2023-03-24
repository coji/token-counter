import { encoding_for_model } from '@dqbd/tiktoken'
import type { ChatCompletionModel } from '~/types/chat-completion'

/**
 * Tiktoken エンコーダ
 * @param model
 * @returns
 */
export const createTiktokenEncoder = (model: ChatCompletionModel) => {
  const encoder = encoding_for_model(model)
  const free = () => {
    encoder.free()
  }

  const encode = (text: string) => {
    return encoder.encode(text)
  }

  return {
    encode,
    free,
  }
}
