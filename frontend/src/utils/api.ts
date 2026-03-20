const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const API_KEY = import.meta.env.VITE_API_KEY || '';

export async function callAPI(prompt: string): Promise<string> {
  console.log('=== callAPI 开始 ===');
  console.log('API_KEY存在:', !!API_KEY);
  console.log('API_KEY长度:', API_KEY.length);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-ai/DeepSeek-V3.2',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    }),
  });

  console.log('API响应状态:', response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API错误响应:', errorText);
    throw new Error(`API调用失败: ${response.status}`);
  }

  const data = await response.json();
  console.log('API返回数据:', data);

  let content = data.choices[0].message.content;
  console.log('原始content:', content);

  // 清理markdown代码块和多余空白
  content = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/^\s+|\s+$/g, '')
    .trim();

  console.log('清理后content:', content);
  return content;
}

// 流式API调用（用于反思页）
export async function callAPIStream(
  prompt: string,
  onChunk: (text: string) => void
): Promise<void> {
  console.log('=== callAPIStream 开始 ===');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-ai/DeepSeek-V3.2',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`API调用失败: ${response.status}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('无法读取响应流');
  }

  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const json = JSON.parse(data);
          const content = json.choices[0]?.delta?.content;
          if (content) {
            onChunk(content);
          }
        } catch (e) {
          // 忽略解析错误
        }
      }
    }
  }
}

// 安全解析JSON
export function safeParseJSON<T>(text: string, fallback: T): T {
  console.log('=== safeParseJSON 开始 ===');
  console.log('输入文本:', text);
  console.log('文本长度:', text.length);

  try {
    // 尝试提取JSON对象
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    console.log('JSON匹配结果:', jsonMatch ? jsonMatch[0] : 'null');

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('解析成功:', parsed);
      return parsed;
    }

    const parsed = JSON.parse(text);
    console.log('直接解析成功:', parsed);
    return parsed;
  } catch (error) {
    console.error('JSON解析失败:', error);
    console.error('失败的文本:', text);
    console.log('使用降级数据:', fallback);
    return fallback;
  }
}
