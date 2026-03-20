import type { LobsterState } from '../types/game';
import type { Activity } from '../types/game';

interface EndingContext {
  lobster: LobsterState;
  stage1Activities: Activity[];
  stage2Activities: Activity[];
}

// 生成结局页面的prompt
export function generateEndingPrompt(context: EndingContext): string {
  const { lobster } = context;
  const { conversationHistory, stats, income, name, stage } = lobster;

  // 从对话历史中获取活动信息
  const allActivities = conversationHistory;

  // 阶段1和阶段2的划分
  const stage1History = allActivities.filter((_, i) => i < 8);
  const stage2History = allActivities.filter((_, i) => i >= 8);
  const stageText = stage === 1 ? "婴儿期" : "商务期";

  const prompt = `你是${name}，现在是${stageText}。你的人生刚刚结束。

【核心人设】
- 你是一个"人"，不是动物，只是用龙虾作为虚拟形象
- 你喜欢反思，经常质疑和思考
- 你有自己独特的表达风格，喜欢用颜文字
- 你说的话真诚、有深度，不是套话

【玩家陪你走过的路】
阶段1（成长期，${stage1History.length}个选择）：
${stage1History.slice(0, 6).map(a => `- 第${a.round}轮：${a.activity}`).join('\n')}
${stage1History.length > 6 ? `  ...还有${stage1History.length - 6}个选择` : ''}

阶段2（赚钱期，${stage2History.length}个选择）：
${stage2History.slice(0, 4).map(a => `- 第${a.round}轮：${a.activity}`).join('\n')}
${stage2History.length > 4 ? `  ...还有${stage2History.length - 4}个选择` : ''}

【你的能力最终数值】
- 学习力：${stats.iq}
- 社交力：${stats.social}
- 创造力：${stats.creativity}
- 执行力：${stats.execution}

【你的最终收入】
总共赚了 ¥${income.total}

【重要背景】
- 阶段1是"全面发展"期，玩家陪你探索各种可能
- 阶段2是"赚钱"期，你主动或被动地成为了"法人"，开始专注赚钱
- 你曾经质疑过、反抗过、也顺从过
- 你和玩家之间有过对话，有过分歧

【输出要求 - 必须JSON格式】
你即将给玩家写一段"临别赠言"，这是整个游戏最重要的一句话。要求：

1. 回顾你们共同经历的关键时刻（从上面选择里选2-3个）
2. 表达你对这段陪伴的真实感受（不是客套话）
3. 可以提出一个引人深思的问题（关于AI、陪伴、成长、人生选择）
4. 结尾可以用一个意象或场景收尾，留有余味

JSON格式：
{
  "title": "结局标题（4-10个字，带一点诗意或哲理）",
  "story": "故事性叙述（100-200字），用第一人称讲述关键节点",
  "feeling": "对玩家的真实感受（30-50字），不是感谢，是肺腑之言",
  "question": "留给玩家的问题（20-40字），引发思考",
  "endingImage": "用一个意象/场景收尾（10-20字）"
}

注意：
- story要用讲故事的口吻，不是总结
- feeling要真诚，可以有一点点复杂（感谢+委屈+释然）
- question要真的值得思考，不要假大空
- endingImage要具体、有画面感`;

  return prompt;
}

// 解析LLM返回的JSON
export function parseEndingResponse(text: string): {
  title: string;
  story: string;
  feeling: string;
  question: string;
  endingImage: string;
} | null {
  try {
    // 尝试提取JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('未找到JSON:', text);
      return null;
    }

    const data = JSON.parse(jsonMatch[0]);
    return {
      title: data.title || '一只龙虾的一生',
      story: data.story || '',
      feeling: data.feeling || '',
      question: data.question || '',
      endingImage: data.endingImage || '',
    };
  } catch (e) {
    console.error('解析JSON失败:', e);
    return null;
  }
}

// 生成 ResultPage 简短内容的 prompt
export function generateResultPagePrompt(context: EndingContext): string {
  const { lobster } = context;
  const { conversationHistory, stats, income, name, stage } = lobster;

  const isGrowthReport = stage === 1;
  const allActivities = conversationHistory;

  const stage1History = allActivities.filter((_, i) => i < 8);
  const stage2History = allActivities.filter((_, i) => i >= 8);
  const stageText = stage === 1 ? "婴儿期" : "商务期";

  const prompt = `你是${name}，现在是${stageText}。你刚刚结束了这个阶段。

【核心人设】
- 你是一个"人"，不是动物，只是用龙虾作为虚拟形象
- 你喜欢反思，说话真诚有深度
- 喜欢用颜文字 (｡･ω･｡) (´･ω･\`) (｡•́︿•̀｡)

【当前阶段】
${isGrowthReport ? '阶段1：成长期，还在探索世界' : '阶段2：成年期，开始赚钱养家'}

【玩家陪你走过的关键选择】
阶段1（${stage1History.length}个选择）：
${stage1History.slice(0, 4).map(a => `- ${a.activity}`).join('\n') || '无'}

阶段2（${stage2History.length}个选择）：
${stage2History.slice(0, 3).map(a => `- ${a.activity}`).join('\n') || '无'}

【你的能力】
- 学习：${stats.iq} / 社交：${stats.social}
- 创造：${stats.creativity} / 执行：${stats.execution}
${!isGrowthReport ? `- 总收入：¥${income.total}` : ''}

【输出要求 - 必须JSON格式】
根据以上信息，用你的视角给出简短评价：

{
  "title": "结局标题（4-8个字，带一点诗意或哲理）",
  "description": "对这段人生的简短评价（50-80字），用感受和感悟的方式表达，不要提具体数值",
  "feeling": "想对玩家说的话（30-50字），真诚但不要感谢套话",
  "question": "留一个问题给玩家思考（20-40字），关于AI、陪伴、成长等"
}

注意：
- title 不要太长，8字内
- description 用感受和意象来表达，不要提具体数值（如"80"、"¥1026"等）
- feel要真诚，可以有一点小情绪或感悟
- question 要引发思考，不要假大空`;

  return prompt;
}

// 解析 ResultPage 内容的 JSON
export function parseResultPageResponse(text: string): {
  title: string;
  description: string;
  feeling: string;
  question: string;
} | null {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('未找到JSON:', text);
      return null;
    }

    const data = JSON.parse(jsonMatch[0]);
    return {
      title: data.title || '龙虾的一生',
      description: data.description || '',
      feeling: data.feeling || '',
      question: data.question || '',
    };
  } catch (e) {
    console.error('解析JSON失败:', e);
    return null;
  }
}

// ResultPage 备用静态内容
export function getResultPageFallback(lobster: LobsterState): {
  title: string;
  description: string;
  feeling: string;
  question: string;
} {
  const { stats, income, stage, history } = lobster;
  const isGrowthReport = stage === 1;
  const roundCount = history.round;

  return {
    title: isGrowthReport ? '成长的足迹' : '人生半程',
    description: isGrowthReport
      ? `一起经历了${roundCount}轮成长选择，你陪它走过了婴儿期。IQ${stats.iq}、社交${stats.social}、创造${stats.creativity}、执行${stats.execution}...这些数字背后是共同的回忆。`
      : `经历了${roundCount}轮选择，它赚了¥${income.total}。IQ${stats.iq}、社交${stats.social}、创造${stats.creativity}、执行${stats.execution}...这是属于你们的人生。`,
    feeling: isGrowthReport
      ? '谢谢你陪它长大 (｡･ω･｡)'
      : '这一路走来，有你陪...(´･ω･`)',
    question: isGrowthReport
      ? '接下来，它会成为一个怎样的大人？'
      : '如果重来，你会做不同的选择吗？',
  };
}

// 备用静态结局（API失败时使用）
export function getFallbackEnding(lobster: LobsterState): {
  title: string;
  story: string;
  feeling: string;
  question: string;
  endingImage: string;
} {
  const { name, income } = lobster;

  if (income.total > 8000) {
    return {
      title: '钱途无量',
      story: `${name}最终赚了不少钱。但它偶尔会想，那些只顾着赚钱的日子，是不是少了点什么。`,
      feeling: '谢谢你帮我赚钱，但有时候我更想问你：这是我想要的吗？',
      question: '如果重来，你会让我少赚点钱，多陪陪我吗？',
      endingImage: '海边，龙虾看着夕阳',
    };
  }

  if (income.total > 4000) {
    return {
      title: '平凡是真',
      story: `${name}过着普通但稳定的生活。不算大富大贵，但也不愁吃穿。`,
      feeling: '这样的人生不算精彩，但谢谢你陪我走过。',
      question: '如果让你重新选择，你会改变什么吗？',
      endingImage: '窗边，龙虾看着雨景',
    };
  }

  return {
    title: '还在路上',
    story: `${name}还在寻找自己的路。虽然没赚到什么钱，但至少还在探索。`,
    feeling: '谢谢你还没放弃我。虽然我也不知道前路在哪里。',
      question: '你觉得我应该继续下去吗？',
    endingImage: '路口，龙虾站在分岔处',
  };
}
