import type { Activity } from '../types/game';

// 阶段1：能力培养期活动
export const stage1Activities: Activity[] = [
  { id: 'learn1', name: '学习编程', description: '提升逻辑思维和问题解决能力', stage: 1, icon: '/images/choose_1/图标2-笔记本电脑.png' },
  { id: 'social1', name: '参加社团', description: '结识新朋友，提升社交能力', stage: 1, icon: '/images/choose_1/社交图标3-团队.png' },
  { id: 'create1', name: '独立思考', description: '培养独立思考和创新能力', stage: 1, icon: '/images/choose_1/创造图标1-灯泡.png' },
  { id: 'exec1', name: '完成任务', description: '提升执行力和自律能力', stage: 1, icon: '/images/choose_1/执行图标2-靶心-白底.jpg' },
  { id: 'learn2', name: '读书', description: '拓展知识面，提升学习能力', stage: 1, icon: '/images/choose_1/图标1-书本.png' },
  { id: 'social2', name: '交朋友', description: '建立人际关系网络', stage: 1, icon: '/images/choose_1/社交图标2-握手.png' },
  { id: 'create2', name: '做项目', description: '动手实践，培养创造力', stage: 1, icon: '/images/choose_1/创造图标2-文件夹.jpg' },
  { id: 'exec2', name: '坚持习惯', description: '养成良好习惯，提升执行力', stage: 1, icon: '/images/choose_1/执行图标3-日历.png' },
  { id: 'art1', name: '学艺术', description: '培养审美和创造力', stage: 1, icon: '/images/choose_1/图标3-调色板.png' },
  { id: 'sport1', name: '运动健身', description: '强健体魄，提升精力', stage: 1, icon: '/images/choose_1/执行图标5-奖杯-白底.png' },
  { id: 'music1', name: '学音乐', description: '陶冶情操，培养艺术感', stage: 1, icon: '/images/choose_1/创造图标6-星星.jpg' },
  { id: 'write1', name: '写作', description: '提升表达能力和思维深度', stage: 1, icon: '/images/choose_1/创造图标3-钢笔.jpg' },
];

// 阶段2：赚钱期活动
export const stage2Activities: Activity[] = [
  { id: 'code1', name: '写代码-接外包', description: '预期收入：¥500-1000', stage: 2, icon: '/images/choose_2/赚钱图标1-代码括号.jpg' },
  { id: 'ecom1', name: '做电商-开店', description: '预期收入：¥300-800', stage: 2, icon: '/images/choose_2/赚钱图标2-购物车.png' },
  { id: 'research1', name: '做科研-发论文', description: '预期收入：¥600-1200', stage: 2, icon: '/images/choose_2/赚钱图标4-公文包.png' },
  { id: 'job1', name: '找工作-投简历', description: '预期收入：¥200-500', stage: 2, icon: '/images/choose_2/赚钱图标4-公文包.png' },
  { id: 'design1', name: '做设计-接单', description: '预期收入：¥400-900', stage: 2, icon: '/images/choose_1/创造图标4-画板.jpg' },
  { id: 'teach1', name: '当老师-辅导', description: '预期收入：¥300-700', stage: 2, icon: '/images/choose_2/赚钱图标5-美元符号.png' },
];
