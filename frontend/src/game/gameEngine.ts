import type { LobsterState, Activity } from '../types/game';

// 执行活动并更新属性
export function executeActivity(
  lobster: LobsterState,
  activity: Activity
): { newStats: LobsterState['stats']; feedback: string } {
  const effects = getActivityEffects(activity.id);

  const newStats = {
    iq: Math.max(0, Math.min(100, lobster.stats.iq + effects.iq)),
    social: Math.max(0, Math.min(100, lobster.stats.social + effects.social)),
    creativity: Math.max(0, Math.min(100, lobster.stats.creativity + effects.creativity)),
    execution: Math.max(0, Math.min(100, lobster.stats.execution + effects.execution)),
  };

  return { newStats, feedback: effects.feedback };
}

// 活动效果配置（包含矛盾点：有得有失）
function getActivityEffects(activityId: string) {
  const effects: Record<string, { iq: number; social: number; creativity: number; execution: number; feedback: string }> = {
    // 阶段1：能力培养期
    learn1: { iq: 8, social: -3, creativity: 2, execution: 3, feedback: '学习编程提升了逻辑思维，但减少了社交时间' },
    social1: { iq: 0, social: 8, creativity: 3, execution: -2, feedback: '参加社团结识了新朋友，但耽误了一些任务' },
    create1: { iq: 3, social: -2, creativity: 8, execution: 0, feedback: '独立思考培养了创新能力，但显得有些孤僻' },
    exec1: { iq: 0, social: 0, creativity: -3, execution: 8, feedback: '完成任务提升了执行力，但限制了创造性思维' },
    learn2: { iq: 6, social: 2, creativity: 4, execution: 2, feedback: '读书拓展了知识面，各方面都有提升' },
    social2: { iq: -2, social: 8, creativity: 2, execution: 0, feedback: '交朋友提升了社交能力，但学习时间减少了' },
    create2: { iq: 4, social: 0, creativity: 8, execution: 4, feedback: '做项目锻炼了创造力和执行力' },
    exec2: { iq: 2, social: -2, creativity: 0, execution: 8, feedback: '坚持习惯提升了自律性，但社交活动减少了' },
  };

  return effects[activityId] || { iq: 0, social: 0, creativity: 0, execution: 0, feedback: '完成了活动' };
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
