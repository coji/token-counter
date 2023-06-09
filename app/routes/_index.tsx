import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { json, type ActionArgs, type LoaderArgs } from '@vercel/remix'
import { z } from 'zod'
import { AppButton, AppCard, AppCardBody, AppCardTitle, AppInput, AppSelect } from '~/components'
import { useOpenAIApiKey } from '~/hooks/useOpenAIApiKey'
import { chatCompletion, type ChatCompletionRequestMessage } from '~/services/chatgpt-api.server'
import { sessionStorage } from '~/services/session.server'
import { countTokens } from '~/services/token-count.server'

const schema = z.object({
  model: z.enum(['gpt-3.5-turbo', 'gpt-4']),
  input: z.string(),
  apiKey: z.string().optional(),
})

export const loader = async ({ request }: LoaderArgs) => {
  const session = await sessionStorage.getSession(request.headers.get('Cookie') ?? '')
  const apiKey = session.get('apiKey')
  return json({ apiKey })
}

export const action = async ({ request }: ActionArgs) => {
  // フォームデータを取得し検証
  const formData = await request.formData()
  const { model, input, apiKey } = schema.parse(Object.fromEntries(formData.entries()))

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
  const countedTokens = {
    tiktoken: countTokens('tiktoken', model, messages),
    'gpt-3-encoder': countTokens('gpt-3-encoder', model, messages),
  }

  // ChatGPT APIを呼び出して応答を取得
  const response = await chatCompletion(model, messages, apiKey)

  return json({
    messages,
    countedTokens,
    response,
  })
}

export default function Index() {
  const { apiKey: storedApiKey } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()

  const { apiKeyInput, apiKey } = useOpenAIApiKey(storedApiKey)

  return (
    <div className="font-sans leading-6 mx-auto grid grid-rows-[auto_1fr_auto] h-screen">
      <div className="relative">
        <div className="absolute right-4 top-0">{apiKeyInput}</div>
        <h1 className="text-4xl font-bold text-center my-16">
          <div>Token Counter</div>
          <div className="text-slate-500 text-sm">for ChatGPT API</div>
        </h1>
      </div>

      <div>
        <Form replace method="post" className="w-full">
          <div className="flex gap-4 py-2 px-4 items-end">
            <input type="hidden" name="apiKey" value={apiKey} />

            <AppSelect label="Model" name="model">
              <option value="gpt-4" selected>
                gpt-4
              </option>
              <option defaultValue="gpt-3.5-turbo">gpt-3.5-turbo</option>
            </AppSelect>

            <AppInput name="input" label="User input" className="flex-1" />

            <AppButton type="submit" disabled={navigation.state !== 'idle'} isLoading={navigation.state !== 'idle'}>
              Count Tokens
            </AppButton>
          </div>
        </Form>

        {actionData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            <AppCard>
              <AppCardTitle>Prompt</AppCardTitle>
              <AppCardBody>
                <pre className="overflow-auto text-xs">{JSON.stringify(actionData.messages, null, 2)}</pre>
              </AppCardBody>
            </AppCard>

            <AppCard>
              <AppCardTitle>Prompt Tokens Counted</AppCardTitle>
              <AppCardBody>
                <div>tiktoken: {actionData.countedTokens['tiktoken']}</div>
                <div>gpt-3-encoder: {actionData.countedTokens['gpt-3-encoder']}</div>
              </AppCardBody>
            </AppCard>

            <AppCard>
              <AppCardTitle>API Response</AppCardTitle>
              <AppCardBody>
                <pre className="overflow-auto text-xs">{JSON.stringify(actionData.response, null, 2)}</pre>
              </AppCardBody>
            </AppCard>
          </div>
        )}
      </div>

      <div className="text-center">
        <div>Copyright &copy; {new Date().getFullYear()} coji.</div>
        <div>
          <a href="https://github.com/coji/token-counter" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
