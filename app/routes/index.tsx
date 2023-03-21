import { type ActionArgs, json } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { encode } from 'gpt-3-encoder'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const text = formData.get('text') as string
  return json({ tokens: encode(text).length })
}

export default function Index() {
  const fetcher = useFetcher<typeof action>()

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Token Counter</h1>

      <fetcher.Form replace method="post">
        <textarea name="text"></textarea>
        <button type="submit">Count Tokens</button>
        <div>{JSON.stringify(fetcher)}</div>
      </fetcher.Form>
    </div>
  )
}
