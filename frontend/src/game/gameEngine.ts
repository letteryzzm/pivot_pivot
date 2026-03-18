import type { LobsterState, Activity, FeedbackResponse } from '../types/game';

// 应用AI返回的成长值
export function applyAIGrowth(
  lobster: LobsterState,
  aiResponse: FeedbackResponse
): LobsterState['stats'] {
  const { growth } = aiResponse;

  return {
    iq: Math.max(0, Math.min(100, lobster.stats.iq + growth.iq)),
    social: Math.max(0, Math.min(100, lobster.stats.social + growth.social)),
    creativity: Math.max(0, Math.min(100, lobster.stats.creativity + growth.creativity)),
    execution: Math.max(0, Math.min(100, lobster.stats.execution + growth.execution)),
  };
}

// 计算收入（阶段2）
export function calculateIncome(lobster: LobsterState, activity: Activity): number {
  const { iq, social, creativity, execution } = lobster.stats;

  const incomeMap: Record<string, () => number> = {
    code1: () => Math.floor(500 + iq * 5 + execution * 3),
    ecom1: () => Math.floor(300 + social * 4 + creativity * 4),
    research1: () => Math.floor(600 + iq * 6 + creativity * 2),
    job1: () => Math.floor(200 + execution * 3 + social * 2),
  };

  return incomeMap[activity.id]?.() || 0;
}
