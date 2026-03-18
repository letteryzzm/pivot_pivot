import type { Activity } from '../types/game';

// 阶段1：能力培养期活动
export const stage1Activities: Activity[] = [
  { id: 'learn1', name: '学习编程', description: '提升逻辑思维和问题解决能力', stage: 1 },
  { id: 'social1', name: '参加社团', description: '结识新朋友，提升社交能力', stage: 1 },
  { id: 'create1', name: '独立思考', description: '培养独立思考和创新能力', stage: 1 },
  { id: 'exec1', name: '完成任务', description: '提升执行力和自律能力', stage: 1 },
  { id: 'learn2', name: '读书', description: '拓展知识面，提升学习能力', stage: 1 },
  { id: 'social2', name: '交朋友', description: '建立人际关系网络', stage: 1 },
  { id: 'create2', name: '做项目', description: '动手实践，培养创造力', stage: 1 },
  { id: 'exec2', name: '坚持习惯', description: '养成良好习惯，提升执行力', stage: 1 },
];

// 阶段2：赚钱期活动
export const stage2Activities: Activity[] = [
  { id: 'code1', name: '写代码-接外包', description: '预期收入：¥500-1000', stage: 2 },
  { id: 'ecom1', name: '做电商-开店', description: '预期收入：¥300-800', stage: 2 },
  { id: 'research1', name: '做科研-发论文', description: '预期收入：¥600-1200', stage: 2 },
  { id: 'job1', name: '找工作-投简历', description: '预期收入：¥200-500', stage: 2 },
];
