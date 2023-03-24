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
  apiKey: z.string().min(1).max(1000),
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
  const countedTokens = countTokens('tiktoken', model, messages)

  // ChatGPT APIを呼び出して応答を取得
  const response = await chatCompletion('gpt-3.5-turbo', messages, apiKey)

  return json({
    messages,
    countedTokens,
    response,
  })
}

export default function Index() {
  const { apiKey: storedApiKey } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  console.log(actionData)
  const navigation = useNavigation()

  const { apiKeyInput, apiKey } = useOpenAIApiKey(storedApiKey)

  return (
    <div className="font-sans leading-6 mx-auto grid grid-rows-[auto_1fr_auto] h-screen">
      <div className="relative">
        <div className="absolute right-4 top-0">{apiKeyInput}</div>
        <h1 className="text-4xl font-bold text-center my-16">Token Counter</h1>
      </div>

      <div>
        <Form replace method="post" className="w-full">
          <div className="flex gap-4 py-2 px-4 items-end">
            <input type="hidden" name="apiKey" value={apiKey} />

            <AppSelect label="Model" name="model">
              <option selected value="gpt-4">
                gpt-4
              </option>
              <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            </AppSelect>

            <AppInput name="input" label="Prompt" className="flex-1" />

            <AppButton type="submit" disabled={navigation.state !== 'idle' || !apiKey}>
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
              <AppCardBody>{actionData.countedTokens}</AppCardBody>
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

      <div className="text-center">Copyright &copy; {new Date().getFullYear()} coji.</div>
    </div>
  )
}
