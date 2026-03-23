const API_URL = 'https://api.siliconflow.cn/v1/chat/completions'
const API_KEY = import.meta.env.VITE_API_KEY || ''

export async function callAPI(prompt: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-ai/DeepSeek-V3.2',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    }),
  })

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`)
  }

  const data = await response.json()
  const content: string = data.choices[0].message.content

  return content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/^\s+|\s+$/g, '')
    .trim()
}

export async function callAPIStream(
  prompt: string,
  onChunk: (text: string) => void
): Promise<void> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-ai/DeepSeek-V3.2',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      stream: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`)
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) {
    throw new Error('Cannot read response stream')
  }

  let buffer = ''

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') continue

        try {
          const json = JSON.parse(data)
          const content = json.choices[0]?.delta?.content
          if (content) {
            onChunk(content)
          }
        } catch {
          // Ignore parse errors in stream
        }
      }
    }
  }
}
