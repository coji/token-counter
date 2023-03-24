import { encode as gpt3encode } from 'gpt-3-encoder'
import type { ChatCompletionModel } from '~/types/chat-completion'

/**
 * gpt-3-encode エンコーダ
 * @param model
 * @returns
 */
export const createGpt3EncodeEncoder = (model: ChatCompletionModel) => {
  const free = () => {
    // nothing todo
  }

  const encode = (text: string) => {
    return gpt3encode(text)
  }

  return {
    encode,
    free,
  }
}
