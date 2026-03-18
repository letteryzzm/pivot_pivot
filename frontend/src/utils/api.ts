const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const API_KEY = import.meta.env.VITE_API_KEY || '';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function callAPI(prompt: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'stepfun-ai/Step-3.5-Flash',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    throw new Error('API调用失败');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
