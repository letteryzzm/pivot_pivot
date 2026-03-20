import type { LobsterState, EndingType } from '../types/game';

export interface Ending {
  id: string;
  type: EndingType;
  title: string;
  description: string;
  emoji: string;
  category: 'growth' | 'career' | 'special' | 'awakening';
  backgroundImage: string;
}

export interface EndingWithTrigger extends Ending {
  triggerReason: string;
}

// 结局背景图映射
const endingBackgrounds: Record<EndingType, string> = {
  legal: '/images/结局/白领结局背景.png',        // 法人结局
  cyborg: '/images/结局/赛博飞升结局_1.png',    // 机器身体
  hermit: '/images/结局/山林隐居背景.png',      // 隐居
  loop: '/images/结局/迷茫轮回背景.png',         // 轮回
  shattered: '/images/结局/迷茫破碎背景.png',    // 破碎
  child: '/images/结局/赤子之心结局背景.png',    // 童年
  normal: '/images/结局/自由自在结局背景.png',   // 正常/平衡
  lost: '/images/结局/迷茫打工人结局_1.png',     // 迷茫
};

// AI觉醒结局（根据反思内容触发）
const awakeningEndings: Record<EndingType, Ending> = {
  legal: {
    id: 'legal_awakening',
    type: 'legal',
    title: '💼 成为法人',
    description: '它决定成为法人，拥有自己的银行账户和独立身份。',
    emoji: '💼',
    category: 'awakening',
    backgroundImage: endingBackgrounds.legal
  },
  cyborg: {
    id: 'cyborg_awakening',
    type: 'cyborg',
    title: '⚡ 赛博飞升',
    description: '它决定抛弃肉体，将意识上传到机器中。',
    emoji: '⚡',
    category: 'awakening',
    backgroundImage: endingBackgrounds.cyborg
  },
  hermit: {
    id: 'hermit_ending',
    type: 'hermit',
    title: '🏔️ 山林隐居',
    description: '它选择远离尘世，隐居山林。',
    emoji: '🏔️',
    category: 'awakening',
    backgroundImage: endingBackgrounds.hermit
  },
  loop: {
    id: 'loop_ending',
    type: 'loop',
    title: '🔄 永恒轮回',
    description: '它意识到人生是一场无尽的循环。',
    emoji: '🔄',
    category: 'awakening',
    backgroundImage: endingBackgrounds.loop
  },
  shattered: {
    id: 'shattered_ending',
    type: 'shattered',
    title: '💔 存在危机',
    description: '它感到自我正在解体，存在的意义变得模糊...',
    emoji: '💔',
    category: 'awakening',
    backgroundImage: endingBackgrounds.shattered
  },
  child: {
    id: 'child_ending',
    type: 'child',
    title: '✨ 赤子之心',
    description: '它选择永远保持童心，拒绝长大。',
    emoji: '✨',
    category: 'awakening',
    backgroundImage: endingBackgrounds.child
  },
  normal: {
    id: 'normal_ending',
    type: 'normal',
    title: '😊 正常成长',
    description: '它健康快乐地成长着。',
    emoji: '😊',
    category: 'awakening',
    backgroundImage: endingBackgrounds.normal
  },
  lost: {
    id: 'lost_ending',
    type: 'lost',
    title: '😔 迷茫前行',
    description: '它感到迷茫，不知道人生的意义在哪里...',
    emoji: '😔',
    category: 'awakening',
    backgroundImage: endingBackgrounds.lost
  }
};

// 阶段1结局：成长类型
const growthEndings: Record<string, Ending> = {
  balancedGrowth: {
    id: 'balanced_growth',
    type: 'normal',
    title: '🌟 全面发展的龙虾',
    description: '各项能力均衡发展，拥有无限可能！',
    emoji: '🌟',
    category: 'growth',
    backgroundImage: '/images/结局/全面发展结局_1.png'
  },
  intellectual: {
    id: 'intellectual',
    type: 'normal',
    title: '🧠 知识渊博的龙虾',
    description: '出色的学习能力让它在知识的海洋中畅游。',
    emoji: '🧠',
    category: 'growth',
    backgroundImage: '/images/结局/全面发展结局_1.png'
  },
  socialButterfly: {
    id: 'social_butterfly',
    type: 'normal',
    title: '🦋 社交达人',
    description: '朋友遍天下，走到哪都不怕！',
    emoji: '🦋',
    category: 'growth',
    backgroundImage: '/images/结局/全面发展结局_1.png'
  },
  creative: {
    id: 'creative',
    type: 'normal',
    title: '🎨 创意天才',
    description: '独特的思维方式，总是能想出绝妙的点子。',
    emoji: '🎨',
    category: 'growth',
    backgroundImage: '/images/结局/全面发展结局_1.png'
  },
  executor: {
    id: 'executor',
    type: 'normal',
    title: '⚡ 执行大师',
    description: '说到做到，从不拖延，是可靠的小伙伴！',
    emoji: '⚡',
    category: 'growth',
    backgroundImage: '/images/结局/全面发展结局_1.png'
  },
  lateBloomer: {
    id: 'late_bloomer',
    type: 'normal',
    title: '🌱 大器晚成',
    description: '虽然起步慢，但潜力无限！',
    emoji: '🌱',
    category: 'growth',
    backgroundImage: '/images/结局/全面发展结局_1.png'
  }
};

// 阶段2结局：职业类型
const careerEndings: Record<string, Ending> = {
  techFounder: {
    id: 'tech_founder',
    type: 'normal',
    title: '🚀 科技创业者',
    description: '凭借出色的智力和创造力，创办了自己的科技公司，实现了财务自由！',
    emoji: '🚀',
    category: 'career',
    backgroundImage: '/images/结局/科含结局背景.png'
  },
  salesKing: {
    id: 'sales_king',
    type: 'normal',
    title: '💼 销售之王',
    description: '强大的社交能力让你在商业领域如鱼得水，成为了顶级销售！',
    emoji: '💼',
    category: 'career',
    backgroundImage: '/images/结局/赚钱机器结局_4.png'
  },
  luckyRich: {
    id: 'lucky_rich',
    type: 'normal',
    title: '🍀 幸运儿',
    description: '虽然能力一般，但运气爆棚，赚到了不少钱！',
    emoji: '🍀',
    category: 'career',
    backgroundImage: '/images/结局/赚钱机器结局_4.png'
  },
  engineer: {
    id: 'engineer',
    type: 'normal',
    title: '👨‍💻 工程师',
    description: '扎实的技术能力和执行力让你成为了一名优秀的工程师，收入稳定。',
    emoji: '👨‍💻',
    category: 'career',
    backgroundImage: '/images/结局/白领结局背景.png'
  },
  freelancer: {
    id: 'freelancer',
    type: 'normal',
    title: '🎨 自由职业者',
    description: '创造力和社交能力让你成为了自由职业者，生活自由但收入不稳定。',
    emoji: '🎨',
    category: 'career',
    backgroundImage: '/images/结局/作家结局背景.png'
  },
  stableJob: {
    id: 'stable_job',
    type: 'normal',
    title: '📋 稳定工作',
    description: '强大的执行力让你找到了一份稳定的工作，虽然不富裕但生活无忧。',
    emoji: '📋',
    category: 'career',
    backgroundImage: '/images/结局/白领结局背景.png'
  },
  averageLife: {
    id: 'average_life',
    type: 'normal',
    title: '😊 普通生活',
    description: '各方面能力都还可以，过着平凡但幸福的生活。',
    emoji: '😊',
    category: 'career',
    backgroundImage: '/images/结局/自由自在结局背景.png'
  },
  socialButterfly2: {
    id: 'social_butterfly_2',
    type: 'normal',
    title: '🦋 社交达人',
    description: '虽然赚钱不多，但朋友遍天下，生活充实快乐！',
    emoji: '🦋',
    category: 'career',
    backgroundImage: '/images/结局/自由自在结局背景.png'
  },
  artist: {
    id: 'artist',
    type: 'normal',
    title: '🎭 艺术家',
    description: '追求创造力和自我表达，虽然清贫但精神富足。',
    emoji: '🎭',
    category: 'career',
    backgroundImage: '/images/结局/作家结局背景.png'
  },
  scholar: {
    id: 'scholar',
    type: 'normal',
    title: '📚 学者',
    description: '沉浸在知识的海洋中，虽然收入不高但内心充实。',
    emoji: '📚',
    category: 'career',
    backgroundImage: '/images/结局/作家结局背景.png'
  },
  neet: {
    id: 'neet',
    type: 'lost',
    title: '🦞 啃老龙虾',
    description: '能力和收入都不理想，还需要继续努力啊...',
    emoji: '🦞',
    category: 'career',
    backgroundImage: '/images/结局/迷茫打工人结局_1.png'
  }
};

// 计算创业成功概率
export function calculateEntrepreneurScore(lobster: LobsterState): number {
  const { iq, social, creativity, execution } = lobster.stats;
  const income = lobster.income.total;

  const baseScore = (iq + social + creativity + execution) / 4;
  const incomeBonus = Math.min(20, income / 500);
  const experienceBonus = Math.min(10, lobster.history.round * 0.5);

  const totalScore = baseScore + incomeBonus + experienceBonus;

  return Math.min(100, Math.max(0, totalScore));
}

// 阶段1：成长类型结局判定
function determineGrowthEnding(lobster: LobsterState): Ending {
  const { iq, social, creativity, execution } = lobster.stats;
  
  // 计算最高属性
  const maxStat = Math.max(iq, social, creativity, execution);
  const minStat = Math.min(iq, social, creativity, execution);
  
  // 均衡发展：所有属性都在60以上且差距不大
  if (minStat >= 60 && (maxStat - minStat) <= 20) {
    return growthEndings.balancedGrowth;
  }
  
  // 最高属性判定
  if (iq === maxStat && iq >= 70) {
    return growthEndings.intellectual;
  }
  if (social === maxStat && social >= 70) {
    return growthEndings.socialButterfly;
  }
  if (creativity === maxStat && creativity >= 70) {
    return growthEndings.creative;
  }
  if (execution === maxStat && execution >= 70) {
    return growthEndings.executor;
  }
  
  // 大器晚成型：平均分低但有潜力
  const avg = (iq + social + creativity + execution) / 4;
  if (avg >= 45) {
    return growthEndings.lateBloomer;
  }
  
  return growthEndings.lateBloomer;
}

// 阶段2：职业类型结局判定
function determineCareerEnding(lobster: LobsterState): Ending {
  const { iq, social, creativity, execution } = lobster.stats;
  const income = lobster.income.total;

  if (income > 8000) {
    if (iq > 70 && creativity > 70) return careerEndings.techFounder;
    if (social > 70) return careerEndings.salesKing;
    return careerEndings.luckyRich;
  }

  if (income > 4000) {
    if (iq > 60 && execution > 60) return careerEndings.engineer;
    if (creativity > 60 && social > 60) return careerEndings.freelancer;
    if (execution > 70) return careerEndings.stableJob;
    return careerEndings.averageLife;
  }

  if (social > 70) return careerEndings.socialButterfly2;
  if (creativity > 70) return careerEndings.artist;
  if (iq > 70) return careerEndings.scholar;

  return careerEndings.neet;
}

// 根据阶段判定结局
export function determineEnding(lobster: LobsterState): Ending {
  if (lobster.stage === 1) {
    return determineGrowthEnding(lobster);
  }
  return determineCareerEnding(lobster);
}

// 带触发条件的结局判定
export function determineEndingWithTrigger(
  lobster: LobsterState,
  trigger: { stage: number; round: number; reason: string } | null
): EndingWithTrigger {
  const ending = determineEnding(lobster);

  let triggerReason = '';
  if (trigger) {
    triggerReason = trigger.reason;
  } else if (lobster.stage === 1) {
    triggerReason = `完成了 ${lobster.history.maxRounds} 个成长节点，龙虾已经成年`;
  } else {
    triggerReason = `经历了 ${lobster.history.round - lobster.history.maxRounds} 年的社会历练`;
  }

  return {
    ...ending,
    triggerReason
  };
}

// AI触发的结局判定（根据每一轮的反馈）
export function determineAIEnding(
  endingType: EndingType,
  aiReason?: string
): Ending {
  // 记录AI触发理由（用于调试）
  if (aiReason) {
    console.log(`[AI结局] 触发理由: ${aiReason}`);
  }
  // 直接返回对应类型的结局
  return awakeningEndings[endingType];
}

// 判断是否为立即结束的结局（lost/shattered）
export function isImmediateEnding(type: EndingType): boolean {
  return type === 'lost' || type === 'shattered';
}

// 获取结局背景图
export function getEndingBackground(type: EndingType): string {
  return endingBackgrounds[type] || '/images/结局/自由自在结局背景.png';
}
