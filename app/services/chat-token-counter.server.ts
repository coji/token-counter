import type { ChatCompletionRequestMessage } from 'openai'
import type { ChatCompletionModel } from '~/types/chat-completion'
import { createTokenEncoder, type TokenEncoderType } from './token-encoder'

/**
 * モデルごとのトークン消費数
 * @param model ChatCompletion API の model。'gpt-3.5-turbo' または 'gpt-4'
 * @description 以下の記事を参考に実装
 * reference: How to format inputs to ChatGPT models
 * https://github.com/openai/openai-cookbook/blob/main/examples/How_to_format_inputs_to_ChatGPT_models.ipynb
 * Tiktoken says ChatGPT's API, gpt-3.5-turbo, uses the cl100k_base encoder, but it appears to use p50k_base in openai #304
 * https://github.com/openai/openai-python/issues/304
 */
const tokensByModel = (
  model: ChatCompletionModel,
): {
  tokensPerMessage: number
  tokensPerName: number
} => {
  if (model === 'gpt-3.5-turbo') {
    console.log('Warning: gpt-3.5-turbo may change over time. Returning num tokens assuming gpt-3.5-turbo-0301.')
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

/**
 * ChatCompletion API にわたすプロンプトのトークン数を見積もる
 * @param tokenEncoderType 使用するエンコードライブラリ。'tiktoken' または 'gpt-3-encode'
 * @param model ChatCompletionAPI で利用するモデル名。'gpt-3.5-turbo' または 'gpt-4'
 * @param messages プロンプト。ChatCompletion API リクエストの messages オブジェクトの形式
 * @returns
 */
export const estimateChatMessagesTokens = (
  tokenEncoderType: TokenEncoderType,
  model: ChatCompletionModel,
  messages: ChatCompletionRequestMessage[],
) => {
  const tokenEncoder = createTokenEncoder(tokenEncoderType, model)
  const { tokensPerMessage, tokensPerName } = tokensByModel(model) // モデルによってサイズが変わる

  let tokens = 0
  for (const message of messages) {
    tokens += tokensPerMessage
    for (const key of Object.keys(message) as (keyof typeof message)[]) {
      tokens += tokenEncoder.encode(message[key] ?? '').length
      if (key === 'name') {
        tokens += tokensPerName
      }
    }
  }
  tokens += 2 // every reply is primed with <im_start>assistant

  tokenEncoder.free()
  return tokens
}
