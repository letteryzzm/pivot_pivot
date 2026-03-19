import { create } from 'zustand';
import type { LobsterState, Activity, FeedbackResponse } from '../types/game';
import { applyAIGrowth, calculateIncome } from '../game/gameEngine';
import { callAPI, safeParseJSON } from '../utils/api';
import { generateFeedbackPrompt } from '../utils/prompts';
import { getRandomFeedback, getActivityType } from '../game/feedbackTemplates';

interface GameStore {
  lobster: LobsterState;
  isPlaying: boolean;
  currentFeedback: FeedbackResponse | null;
  isLoading: boolean;
  shouldShowLegalBreak: boolean;
  shouldShowForceLegal: boolean;
  shouldShowGrowthTransition: boolean;
  userResponse: string;

  startGame: (name: string) => void;
  executeActivity: (activity: Activity) => Promise<void>;
  setUserResponse: (response: string) => void;
  updateConversationWithReflection: (reflection: string) => void;
  addIncome: (amount: number) => void;
  nextStage: () => void;
  checkLegalBreak: () => boolean;
  checkForceLegal: () => boolean;
  checkGrowthTransition: () => boolean;
  checkStage2Transition: () => boolean;
  getGrowthStage: () => 'childhood' | 'teen' | 'adult' | null;
  canEnterEnding: () => boolean;
  getEndingTrigger: () => { stage: number; round: number; reason: string } | null;
  dismissLegalBreak: () => void;
  dismissGrowthTransition: () => void;
  resetGame: () => void;
}

const initialLobster: LobsterState = {
  name: '',
  age: 0,
  stage: 1,
  stats: { iq: 50, social: 50, creativity: 50, execution: 50 },
  income: { total: 0, weekly: 0 },
  history: { activities: [], round: 0, maxRounds: 8 },
  conversationHistory: [],
};

export const useGameStore = create<GameStore>((set, get) => ({
  lobster: initialLobster,
  isPlaying: false,
  currentFeedback: null,
  isLoading: false,
  shouldShowLegalBreak: false,
  shouldShowForceLegal: false,
  shouldShowGrowthTransition: false,
  userResponse: '',

  startGame: (name) => set({
    isPlaying: true,
    lobster: { ...initialLobster, name },
    shouldShowLegalBreak: false,
    shouldShowForceLegal: false
  }),

  executeActivity: async (activity) => {
    console.log('=== executeActivity 开始 ===');
    console.log('活动:', activity);

    // 清空旧的反馈数据
    set({ isLoading: true, currentFeedback: null });

    try {
      const state = get();
      const { lobster } = state;
      console.log('龙虾状态:', lobster);

      // 调用AI获取反馈
      const prompt = generateFeedbackPrompt({
        lobsterName: lobster.name,
        age: lobster.age,
        activityName: activity.name,
        activityDesc: activity.description,
        stats: lobster.stats,
        conversationHistory: lobster.conversationHistory
      });

      console.log('开始调用AI API...');
      const response = await callAPI(prompt);
      console.log('API原始响应:', response);

      const aiResponse = safeParseJSON(response, {
        feedback: '我完成了这个活动 (´･ω･`)',
        execution: 70,
        growth: { iq: 2, social: 2, creativity: 2, execution: 2 }
      });

      console.log('最终响应:', aiResponse);

      // 应用成长值
      const newStats = applyAIGrowth(lobster, aiResponse);
      const newRound = lobster.history.round + 1;

      // 阶段2：计算收入
      let newIncome = lobster.income;
      if (lobster.stage === 2) {
        const income = calculateIncome(lobster, activity);
        newIncome = {
          total: lobster.income.total + income,
          weekly: income
        };
      }

      // 保存到对话历史
      const newConversation = {
        round: newRound,
        activity: activity.name,
        lobsterFeedback: aiResponse.feedback,
      };

      set({
        lobster: {
          ...lobster,
          stats: newStats,
          income: newIncome,
          age: lobster.age + 1,
          history: {
            ...lobster.history,
            activities: [...lobster.history.activities, activity.name],
            round: newRound
          },
          conversationHistory: [...lobster.conversationHistory, newConversation]
        },
        currentFeedback: aiResponse,
        isLoading: false
      });
    } catch (error) {
      console.error('执行失败:', error);
      const state = get();
      const { lobster } = state;

      // 降级方案：使用预设模板
      const activityType = getActivityType(activity.name);
      const fallbackResponse = getRandomFeedback(activityType);

      const newStats = applyAIGrowth(lobster, fallbackResponse);
      const newRound = lobster.history.round + 1;

      // 阶段2：计算收入
      let newIncome = lobster.income;
      if (lobster.stage === 2) {
        const income = calculateIncome(lobster, activity);
        newIncome = {
          total: lobster.income.total + income,
          weekly: income
        };
      }

      set({
        lobster: {
          ...lobster,
          stats: newStats,
          income: newIncome,
          age: lobster.age + 1,
          history: {
            ...lobster.history,
            activities: [...lobster.history.activities, activity.name],
            round: newRound
          }
        },
        currentFeedback: fallbackResponse,
        isLoading: false
      });
    }
  },

  addIncome: (amount) => set((state) => ({
    lobster: {
      ...state.lobster,
      income: {
        total: state.lobster.income.total + amount,
        weekly: amount
      }
    }
  })),

  nextStage: () => set((state) => ({
    lobster: { ...state.lobster, stage: 2, age: 18 }
  })),

  checkLegalBreak: () => {
    const state = get();
    const { lobster } = state;
    // 3-4轮后触发，且还在阶段1
    if (lobster.stage === 1 && lobster.history.round >= 3 && lobster.history.round <= 4) {
      set({ shouldShowLegalBreak: true });
      return true;
    }
    return false;
  },

  checkForceLegal: () => {
    const state = get();
    const { lobster } = state;
    // 24岁强制成为法人
    if (lobster.age >= 24 && lobster.stage === 1) {
      set({ shouldShowForceLegal: true });
      return true;
    }
    return false;
  },

  checkGrowthTransition: () => {
    const state = get();
    const { lobster } = state;
    // 阶段1：基于 round 触发成长过渡
    if (lobster.stage === 1) {
      // round 3, 6, 8 触发成长过渡
      if (lobster.history.round === 3 ||
          lobster.history.round === 6 ||
          lobster.history.round === 8) {
        set({ shouldShowGrowthTransition: true });
        return true;
      }
    }
    // 阶段2：18岁触发
    if (lobster.stage === 2 && lobster.age === 18) {
      set({ shouldShowGrowthTransition: true });
      return true;
    }
    return false;
  },

  checkStage2Transition: () => {
    const state = get();
    const { lobster } = state;
    // 阶段2开始时（18岁）显示成长过渡
    if (lobster.stage === 2 && lobster.age === 18) {
      set({ shouldShowGrowthTransition: true });
      return true;
    }
    return false;
  },

  dismissGrowthTransition: () => set({ shouldShowGrowthTransition: false }),

  // 获取当前成长阶段类型，用于跳转
  getGrowthStage: (): 'childhood' | 'teen' | 'adult' | null => {
    const { lobster } = get();
    // 阶段1：婴儿→儿童 (round 3, age 6)
    if (lobster.stage === 1 && lobster.history.round === 3) {
      return 'childhood';
    }
    // 阶段1：儿童→青少年 (round 6, age 13)
    if (lobster.stage === 1 && lobster.history.round === 6) {
      return 'teen';
    }
    // 阶段1→2：青少年→商务 (round 8 或 stage 2 age 18)
    if ((lobster.stage === 1 && lobster.history.round === 8) ||
        (lobster.stage === 2 && lobster.age === 18)) {
      return 'adult';
    }
    return null;
  },

  dismissLegalBreak: () => set({ shouldShowLegalBreak: false }),

  canEnterEnding: () => {
    const state = get();
    const { lobster } = state;
    
    // 阶段1：达到最大轮次（8轮）
    if (lobster.stage === 1 && lobster.history.round >= lobster.history.maxRounds) {
      return true;
    }
    
    // 阶段2：额外4轮后结束（共12轮）
    if (lobster.stage === 2) {
      const stage2Rounds = lobster.history.round - lobster.history.maxRounds;
      if (stage2Rounds >= 4) {
        return true;
      }
    }
    
    // 特殊年龄触发：30岁强制结局
    if (lobster.age >= 30) {
      return true;
    }
    
    return false;
  },

  getEndingTrigger: () => {
    const state = get();
    const { lobster } = state;
    
    if (lobster.stage === 1 && lobster.history.round >= lobster.history.maxRounds) {
      return {
        stage: 1,
        round: lobster.history.round,
        reason: `完成了 ${lobster.history.maxRounds} 个成长节点，龙虾已经成年`
      };
    }
    
    if (lobster.stage === 2) {
      const stage2Rounds = lobster.history.round - lobster.history.maxRounds;
      if (stage2Rounds >= 4) {
        return {
          stage: 2,
          round: lobster.history.round,
          reason: `经历了 ${stage2Rounds} 年的社会历练`
        };
      }
    }
    
    if (lobster.age >= 30) {
      return {
        stage: lobster.stage,
        round: lobster.history.round,
        reason: `龙虾已经 ${lobster.age} 岁了，是时候回顾一生了`
      };
    }
    
    return null;
  },

  setUserResponse: (response) => set({ userResponse: response }),

  updateConversationWithReflection: (reflection: string) => {
    const state = get();
    const { lobster, userResponse } = state;
    const lastIndex = lobster.conversationHistory.length - 1;

    if (lastIndex >= 0) {
      const updatedHistory = [...lobster.conversationHistory];
      updatedHistory[lastIndex] = {
        ...updatedHistory[lastIndex],
        userResponse: userResponse,
        lobsterReflection: reflection
      };

      set({
        lobster: {
          ...lobster,
          conversationHistory: updatedHistory
        }
      });
    }
  },

  resetGame: () => set({
    lobster: initialLobster,
    isPlaying: false,
    currentFeedback: null,
    shouldShowLegalBreak: false,
    shouldShowForceLegal: false,
    shouldShowGrowthTransition: false
  })
}));
