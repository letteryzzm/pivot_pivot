import type { FeedbackResponse } from '../types/game';

// 预设反馈模板（体现"喜欢反思、喜欢反驳"的人设）
export const feedbackTemplates: Record<string, FeedbackResponse[]> = {
  // 学习类活动
  learn: [
    {
      feedback: '学这个...真的有用吗？(´･ω･`)',
      execution: 75,
      growth: { iq: 4, social: -1, creativity: 2, execution: 1 }
    },
    {
      feedback: '我在想，为什么要学这个呢？(｡･ω･｡)',
      execution: 60,
      growth: { iq: 3, social: 0, creativity: 3, execution: 0 }
    },
    {
      feedback: '学了，但是...我好像不太懂 (｡•́︿•̀｡)',
      execution: 50,
      growth: { iq: 2, social: 0, creativity: 1, execution: 1 }
    }
  ],

  // 社交类活动
  social: [
    {
      feedback: '和别人聊天...我需要这个吗？(´･ω･`)',
      execution: 65,
      growth: { iq: 0, social: 4, creativity: 1, execution: 1 }
    },
    {
      feedback: '他们说的话，我不太认同 (｡•́︿•̀｡)',
      execution: 70,
      growth: { iq: 1, social: 3, creativity: 2, execution: 0 }
    },
    {
      feedback: '社交真的比独处更好吗？(´･ω･`)',
      execution: 55,
      growth: { iq: 0, social: 2, creativity: 2, execution: 0 }
    }
  ],

  // 创造类活动
  create: [
    {
      feedback: '我有自己的想法，但...对吗？(´･ω･`)',
      execution: 80,
      growth: { iq: 1, social: 0, creativity: 5, execution: 2 }
    },
    {
      feedback: '做了，但我觉得还不够好 (｡•́︿•̀｡)',
      execution: 70,
      growth: { iq: 2, social: -1, creativity: 4, execution: 1 }
    },
    {
      feedback: '创造...真的是我想要的吗？(´･ω･`)',
      execution: 60,
      growth: { iq: 1, social: 0, creativity: 3, execution: 0 }
    }
  ],

  // 执行类活动
  execute: [
    {
      feedback: '做完了，但为什么要做这个？(´･ω･`)',
      execution: 85,
      growth: { iq: 0, social: 0, creativity: 0, execution: 5 }
    },
    {
      feedback: '我做了，但...这样真的对吗？(｡･ω･｡)',
      execution: 75,
      growth: { iq: 1, social: 0, creativity: 1, execution: 4 }
    },
    {
      feedback: '完成了，可是我不太想做 (｡•́︿•̀｡)',
      execution: 60,
      growth: { iq: 0, social: 0, creativity: 0, execution: 3 }
    }
  ],

  // 赚钱类活动（阶段2）
  money: [
    {
      feedback: '赚到钱了...但这就是全部吗？(´･ω･`)',
      execution: 80,
      growth: { iq: 1, social: 0, creativity: 1, execution: 3 }
    },
    {
      feedback: '钱是赚了，可是我好累 (｡•́︿•̀｡)',
      execution: 70,
      growth: { iq: 0, social: -1, creativity: 0, execution: 2 }
    },
    {
      feedback: '我在想，只为了钱...值得吗？(´･ω･`)',
      execution: 65,
      growth: { iq: 2, social: 0, creativity: 2, execution: 1 }
    }
  ]
};

// 反思模板（对用户回应的二次思考）
export const reflectionTemplates: string[] = [
  '嗯...我再想想 (´･ω･`)',
  '你说的...我不太确定 (｡･ω･｡)',
  '可是，真的是这样吗？(´･ω･`)',
  '我听到了，但我还是有疑问 (｡•́︿•̀｡)',
  '或许吧...不过我觉得 (´･ω･`)',
  '你这么说，可我觉得... (｡･ω･｡)',
  '我了解了，但还是想再想想 (´･ω･`)',
  '嗯，不过...真的对吗？(｡･ω･｡)'
];

// 根据活动类型获取随机反馈
export function getRandomFeedback(activityType: string): FeedbackResponse {
  const templates = feedbackTemplates[activityType] || feedbackTemplates.execute;
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

// 获取随机反思
export function getRandomReflection(): string {
  const randomIndex = Math.floor(Math.random() * reflectionTemplates.length);
  return reflectionTemplates[randomIndex];
}

// 判断活动类型
export function getActivityType(activityName: string): string {
  if (activityName.includes('学') || activityName.includes('读')) return 'learn';
  if (activityName.includes('社交') || activityName.includes('朋友') || activityName.includes('团队')) return 'social';
  if (activityName.includes('创造') || activityName.includes('项目') || activityName.includes('写作')) return 'create';
  if (activityName.includes('赚钱') || activityName.includes('收入') || activityName.includes('工作')) return 'money';
  return 'execute';
}
