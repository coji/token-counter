import { setTimeout } from 'timers/promises'

import { encode as gpt3encode } from 'gpt-3-encoder'

export const encode = async (text: string) => {
  await setTimeout(1000)
  return gpt3encode(text)
}
