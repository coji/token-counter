import { type ActionArgs, json } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { encode } from '~/services/encode.server'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const text = formData.get('text') as string
  const tokens = encode(text)
  return json({ text, token_length: tokens.length })
}

export default function Index() {
  const fetcher = useFetcher<typeof action>()

  const handleOnInput = (e: React.FormEvent<HTMLInputElement>) => {
    fetcher.submit({ text: e.currentTarget.value }, { method: 'post' })
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Token Counter</h1>

      <fetcher.Form replace method="post">
        <input name="text" onInput={handleOnInput} autoFocus></input>
        <button type="submit">Count Tokens</button>
        <div>{JSON.stringify(fetcher.data)}</div>
      </fetcher.Form>
    </div>
  )
}
