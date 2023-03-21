import { type ActionArgs, json } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { testEstimateChatTokens } from '~/services/chat-token-counter.server'
import {
  chatCompletion,
  type ChatCompletionRequestMessage,
} from '~/services/chatgpt-api.server'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const text = formData.get('text') as string

  // プロンプトのメッセージを作成
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful AI assistant',
    },
    {
      role: 'user',
      content: 'こんにちは、私の名前は桃太郎だよ',
    },
    {
      role: 'assistant',
      content: 'こんにちは！桃太郎さん。なにかお役にたてることはありますか？',
    },
    {
      role: 'user',
      content: '鬼退治がしたいんだけど、きびだんごを作ってもらえるかな？',
    },
    {
      role: 'assistant',
      content: 'お安い御用です！さあ、これがきびだんごですよ。お持ちください。',
    },
    {
      role: 'user',
      content: text,
    },
  ] satisfies ChatCompletionRequestMessage[]

  // トークン数を事前計算
  const estimatedTokens = testEstimateChatTokens('gpt-3.5-turbo', messages)
  
  // ChatGPT APIを呼び出して応答を取得
  const response = await chatCompletion(
    'gpt-3.5-turbo',
    messages,
    process.env.OPENAI_API_KEY ?? '',
  )

  return json({ messages, estimatedTokens, response })
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

export default function Index() {
  const fetcher = useFetcher<typeof action>()

  return (
    <div className="font-sans leading-6 mx-auto grid grid-rows-[auto_1fr_auto] h-screen">
      <h1 className="text-4xl font-bold text-center my-16">Token Counter</h1>

      <fetcher.Form replace method="post" className="w-full">
        <div className="flex gap-4 py-2 px-4">
          <input className="input flex-1" name="text" autoFocus />
          <button
            className={classNames(
              fetcher.state !== 'idle' ? 'loading' : '',
              'btn btn-primary',
            )}
            type="submit"
          >
            Count Tokens
          </button>
        </div>

        <div className={classNames('font-mono py-2 px-4 overflow-auto')}>
          <pre>
          {JSON.stringify(fetcher.data, null, 2)}
          </pre>
        </div>
      </fetcher.Form>

      <div className="text-center">
        Copyright &copy; {new Date().getFullYear()} coji.
      </div>
    </div>
  )
}
