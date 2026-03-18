import type { LobsterState } from '../types/game';

export interface Ending {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

// 计算创业成功概率
export function calculateEntrepreneurScore(lobster: LobsterState): number {
  const { iq, social, creativity, execution } = lobster.stats;
  const income = lobster.income.total;

  // 基础分数：四维属性平均值
  const baseScore = (iq + social + creativity + execution) / 4;

  // 收入加成（最多+20分）
  const incomeBonus = Math.min(20, income / 500);

  // 经验加成：成长节点数（最多+10分）
  const experienceBonus = Math.min(10, lobster.history.round * 0.5);

  // 总分
  const totalScore = baseScore + incomeBonus + experienceBonus;

  // 转换为百分比（0-100）
  return Math.min(100, Math.max(0, totalScore));
}

// 根据属性组合判定结局
export function determineEnding(lobster: LobsterState): Ending {
  const { iq, social, creativity, execution } = lobster.stats;
  const income = lobster.income.total;

  // 高收入结局
  if (income > 8000) {
    if (iq > 70 && creativity > 70) return endings.techFounder;
    if (social > 70) return endings.salesKing;
    return endings.luckyRich;
  }

  // 中等收入结局
  if (income > 4000) {
    if (iq > 60 && execution > 60) return endings.engineer;
    if (creativity > 60 && social > 60) return endings.freelancer;
    if (execution > 70) return endings.stableJob;
    return endings.averageLife;
  }

  // 低收入结局
  if (social > 70) return endings.socialButterfly;
  if (creativity > 70) return endings.artist;
  if (iq > 70) return endings.scholar;

  return endings.neet;
}

const endings = {
  techFounder: {
    id: 'tech_founder',
    title: '🚀 科技创业者',
    description: '凭借出色的智力和创造力，你创办了自己的科技公司，实现了财务自由！',
    emoji: '🚀'
  },
  salesKing: {
    id: 'sales_king',
    title: '💼 销售之王',
    description: '强大的社交能力让你在商业领域如鱼得水，成为了顶级销售！',
    emoji: '💼'
  },
  luckyRich: {
    id: 'lucky_rich',
    title: '🍀 幸运儿',
    description: '虽然能力一般，但运气爆棚，赚到了不少钱！',
    emoji: '🍀'
  },
  engineer: {
    id: 'engineer',
    title: '👨‍💻 工程师',
    description: '扎实的技术能力和执行力让你成为了一名优秀的工程师，收入稳定。',
    emoji: '👨‍💻'
  },
  freelancer: {
    id: 'freelancer',
    title: '🎨 自由职业者',
    description: '创造力和社交能力让你成为了自由职业者，生活自由但收入不稳定。',
    emoji: '🎨'
  },
  stableJob: {
    id: 'stable_job',
    title: '📋 稳定工作',
    description: '强大的执行力让你找到了一份稳定的工作，虽然不富裕但生活无忧。',
    emoji: '📋'
  },
  averageLife: {
    id: 'average_life',
    title: '😊 普通生活',
    description: '各方面能力都还可以，过着平凡但幸福的生活。',
    emoji: '😊'
  },
  socialButterfly: {
    id: 'social_butterfly',
    title: '🦋 社交达人',
    description: '虽然赚钱不多，但朋友遍天下，生活充实快乐！',
    emoji: '🦋'
  },
  artist: {
    id: 'artist',
    title: '🎭 艺术家',
    description: '追求创造力和自我表达，虽然清贫但精神富足。',
    emoji: '🎭'
  },
  scholar: {
    id: 'scholar',
    title: '📚 学者',
    description: '沉浸在知识的海洋中，虽然收入不高但内心充实。',
    emoji: '📚'
  },
  neet: {
    id: 'neet',
    title: '🦞 啃老龙虾',
    description: '能力和收入都不理想，还需要继续努力啊...',
    emoji: '🦞'
  }
};
