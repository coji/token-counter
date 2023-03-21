import { type ActionArgs, json } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { countChatTokens } from '~/services/chat-token-counter.server'
import {
  chatCompletion,
  type ChatCompletionRequestMessage,
} from '~/services/chatgpt-api.server'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const text = formData.get('text') as string

  const messages = [
    {
      role: 'system',
      content: 'b',
//      content: 'You are a helpful AI assistant',
    },
    {
      role: 'user',
      content: text,
    },
  ] satisfies ChatCompletionRequestMessage[]

  const response = await chatCompletion(
    'gpt-3.5-turbo',
    messages,
    process.env.OPENAI_API_KEY ?? '',
  )

  const tokens = countChatTokens('gpt-3.5-turbo', messages)
  return json({ messages, estimated_tokens: tokens, response })
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

export default function Index() {
  const fetcher = useFetcher<typeof action>()

  return (
    <div className="font-sans leading-6 container max-w-lg mx-auto grid grid-rows-[auto_1fr_auto] h-screen">
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
