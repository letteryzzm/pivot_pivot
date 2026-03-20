import type { Activity } from '../types/game';

// 阶段1：能力培养期活动
export const stage1Activities: Activity[] = [
  { id: 'learn1', name: '学习编程', description: '提升逻辑思维和问题解决能力', stage: 1, icon: '/images/choose_1/编程.png' },
  { id: 'social1', name: '参加社团', description: '结识新朋友，提升社交能力', stage: 1, icon: '/images/choose_1/聚会.png' },
  { id: 'create1', name: '独立思考', description: '培养独立思考和创新能力', stage: 1, icon: '/images/choose_1/深思.png' },
  { id: 'exec1', name: '完成任务', description: '提升执行力和自律能力', stage: 1, icon: '/images/choose_1/专注.png' },
  { id: 'learn2', name: '读书', description: '拓展知识面，提升学习能力', stage: 1, icon: '/images/choose_1/阅读.png' },
  { id: 'social2', name: '交朋友', description: '建立人际关系网络', stage: 1, icon: '/images/choose_1/社交.png' },
  { id: 'create2', name: '做项目', description: '动手实践，培养创造力', stage: 1, icon: '/images/choose_1/积木.png' },
  { id: 'exec2', name: '坚持习惯', description: '养成良好习惯，提升执行力', stage: 1, icon: '/images/choose_1/规划.png' },
  { id: 'art1', name: '学艺术', description: '培养审美和创造力', stage: 1, icon: '/images/choose_1/绘画.png' },
  { id: 'sport1', name: '运动健身', description: '强健体魄，提升精力', stage: 1, icon: '/images/choose_1/竞赛.png' },
  { id: 'music1', name: '学音乐', description: '陶冶情操，培养艺术感', stage: 1, icon: '/images/choose_1/冲浪.png' },
  { id: 'write1', name: '写作', description: '提升表达能力和思维深度', stage: 1, icon: '/images/choose_1/写作.png' },
];

// 阶段2：赚钱期活动
export const stage2Activities: Activity[] = [
  { id: 'code1', name: '写代码', description: '预期收入：¥500-1000', stage: 2, icon: '/images/choose_2/代码-接外包.png' },
  { id: 'ecom1', name: '开超市', description: '预期收入：¥300-800', stage: 2, icon: '/images/choose_2/生意-开超市.png' },
  { id: 'research1', name: '体力活', description: '预期收入：¥600-1200', stage: 2, icon: '/images/choose_2/体力-搬砖.png' },
  { id: 'job1', name: '找工作', description: '预期收入：¥200-500', stage: 2, icon: '/images/choose_2/白领-找工作.png' },
  { id: 'design1', name: '炒股', description: '预期收入：¥400-900', stage: 2, icon: '/images/choose_2/股票-炒股.png' },
  { id: 'teach1', name: '当老师', description: '预期收入：¥300-700', stage: 2, icon: '/images/choose_2/白领-找工作.png' },
];
