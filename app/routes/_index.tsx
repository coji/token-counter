import { type ActionArgs, json } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { ValidatedForm } from 'remix-validated-form'
import { z } from 'zod'
import { withZod } from '@remix-validated-form/with-zod'
import { testEstimateChatTokens } from '~/services/chat-token-counter.server'
import {
  chatCompletion,
  type ChatCompletionRequestMessage,
} from '~/services/chatgpt-api.server'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const input = formData.get('input') as string

  // プロンプトのメッセージを作成
  const messages: ChatCompletionRequestMessage[] = [
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
      content: input,
    },
  ]

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

const validator = withZod(
  z.object({
    input: z.string().min(1).max(1000),
    apiKey: z.string().min(1).max(1000),
  }),
)

export default function Index() {
  const fetcher = useFetcher<typeof action>()

  return (
    <div className="font-sans leading-6 mx-auto grid grid-rows-[auto_1fr_auto] h-screen">
      <h1 className="text-4xl font-bold text-center my-16">Token Counter</h1>

      <ValidatedForm
        validator={validator}
        fetcher={fetcher}
        replace
        method="post"
        className="w-full"
      >
        <div className="flex gap-4 py-2 px-4">
          <div className="form-control">
            <label className="label">Input</label>
            <input
              className="input input-bordered flex-1"
              name="input"
              autoFocus
            />
          </div>

          <div className="form-control">
            <label className="label">API Key</label>
            <input className="input input-bordered flex-1" name="apiKey" />
          </div>

          <button
            className={classNames(
              fetcher.state !== 'idle' ? 'loading' : '',
              'btn btn-primary',
            )}
            type="submit"
            disabled={fetcher.state !== 'idle'}
          >
            Count Tokens
          </button>
        </div>

        <div className={classNames('font-mono py-2 px-4 overflow-auto')}>
          <pre>{JSON.stringify(fetcher.data, null, 2)}</pre>
        </div>
      </ValidatedForm>

      <div className="text-center">
        Copyright &copy; {new Date().getFullYear()} coji.
      </div>
    </div>
  )
}
