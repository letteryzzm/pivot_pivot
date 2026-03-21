import type { Activity } from '../types/game';

// 阶段1：创业准备期活动
export const stage1Activities: Activity[] = [
  { id: 'learn1', name: '学编程', description: '掌握技术，成为技术型创始人', stage: 1, icon: '/images/choose_1/编程.png' },
  { id: 'social1', name: '拓人脉', description: '认识潜在合伙人和投资人', stage: 1, icon: '/images/choose_1/聚会.png' },
  { id: 'create1', name: '想点子', description: '培养商业洞察力和创新思维', stage: 1, icon: '/images/choose_1/深思.png' },
  { id: 'exec1', name: '练执行', description: '提升项目推进和落地能力', stage: 1, icon: '/images/choose_1/专注.png' },
  { id: 'learn2', name: '读商业书', description: '学习商业模式和管理知识', stage: 1, icon: '/images/choose_1/阅读.png' },
  { id: 'social2', name: '找导师', description: '向成功创业者学习经验', stage: 1, icon: '/images/choose_1/社交.png' },
  { id: 'create2', name: '做产品', description: '动手打造MVP，验证想法', stage: 1, icon: '/images/choose_1/积木.png' },
  { id: 'exec2', name: '学运营', description: '掌握用户增长和数据分析', stage: 1, icon: '/images/choose_1/规划.png' },
  { id: 'art1', name: '练设计', description: '提升产品审美和用户体验', stage: 1, icon: '/images/choose_1/绘画.png' },
  { id: 'sport1', name: '锻炼身体', description: '保持创业所需的充沛精力', stage: 1, icon: '/images/choose_1/竞赛.png' },
  { id: 'music1', name: '练演讲', description: '提升融资路演和团队管理能力', stage: 1, icon: '/images/choose_1/冲浪.png' },
  { id: 'write1', name: '写BP', description: '学习撰写商业计划书', stage: 1, icon: '/images/choose_1/写作.png' },
];

// 阶段2：创业实战期活动
export const stage2Activities: Activity[] = [
  { id: 'code1', name: '接外包', description: '技术接单，积累第一桶金 ¥500-1000', stage: 2, icon: '/images/choose_2/代码-接外包.png' },
  { id: 'ecom1', name: '开网店', description: '电商创业，卖货赚差价 ¥300-800', stage: 2, icon: '/images/choose_2/生意-开超市.png' },
  { id: 'research1', name: '做App', description: '开发应用，广告或付费变现 ¥600-1200', stage: 2, icon: '/images/choose_2/体力-搬砖.png' },
  { id: 'job1', name: '做培训', description: '知识付费，在线课程 ¥400-900', stage: 2, icon: '/images/choose_2/白领-找工作.png' },
  { id: 'design1', name: '做自媒体', description: '内容创业，流量变现 ¥200-500', stage: 2, icon: '/images/choose_2/股票-炒股.png' },
  { id: 'teach1', name: '做SaaS', description: 'B端服务，订阅收费 ¥800-1500', stage: 2, icon: '/images/choose_2/白领-找工作.png' },
];
