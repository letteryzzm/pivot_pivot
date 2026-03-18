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
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    throw new Error('API调用失败');
  }

  const data = await response.json();
  let content = data.choices[0].message.content;

  // 清理markdown代码块和多余空白
  content = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/^\s+|\s+$/g, '')
    .trim();

  return content;
}

// 安全解析JSON
export function safeParseJSON<T>(text: string, fallback: T): T {
  try {
    // 尝试提取JSON对象
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}
