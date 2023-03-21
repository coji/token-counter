import { type ActionArgs, json } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { encode } from '~/services/encode.server'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const text = formData.get('text') as string
  const tokens = await encode(text)
  return json({ text, token_length: tokens.length })
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

export default function Index() {
  const fetcher = useFetcher<typeof action>()

  const handleOnInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (fetcher.state === 'idle')
      fetcher.submit({ text: e.currentTarget.value }, { method: 'post' })
  }

  return (
    <div className="font-sans leading-6 container max-w-lg mx-auto">
      <h1 className="text-4xl font-bold text-center my-16">Token Counter</h1>

      <fetcher.Form replace method="post" className="w-full">
        <div className="flex gap-4 py-2 px-4">
          <input
            className="input flex-1"
            name="text"
            onInput={handleOnInput}
            autoFocus
          />
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

        <div className={classNames('font-mono py-2 px-4')}>
          {JSON.stringify(fetcher.data)}
        </div>
      </fetcher.Form>
    </div>
  )
}
