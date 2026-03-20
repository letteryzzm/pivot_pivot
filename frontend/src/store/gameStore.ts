import { create } from 'zustand';
import type { LobsterState, Activity, FeedbackResponse, EndingType } from '../types/game';
import { applyAIGrowth, calculateIncome } from '../game/gameEngine';
import { callAPI, safeParseJSON } from '../utils/api';
import { generateFeedbackPrompt } from '../utils/prompts';
import { getRandomFeedback, getActivityType } from '../game/feedbackTemplates';
import { isImmediateEnding } from '../game/endings';

interface GameStore {
  lobster: LobsterState;
  isPlaying: boolean;
  currentFeedback: FeedbackResponse | null;
  currentBackgroundImage: number; // 当前轮次的背景图片ID
  isLoading: boolean;
  shouldShowLegalBreak: boolean;
  shouldShowForceLegal: boolean;
  userResponse: string;

  // AI触发的结局
  aiEndingTrigger: EndingType | null;
  aiEndingReason: string;

  startGame: (name: string) => void;
  executeActivity: (activity: Activity) => Promise<void>;
  setUserResponse: (response: string) => void;
  updateConversationWithReflection: (reflection: string) => void;
  addIncome: (amount: number) => void;
  nextStage: () => void;
  checkLegalBreak: () => boolean;
  checkForceLegal: () => boolean;
  checkAIEnding: () => boolean;
  setAIEnding: (type: EndingType, reason?: string) => void;
  canEnterEnding: () => boolean;
  getEndingTrigger: () => { stage: number; round: number; reason: string } | null;
  dismissLegalBreak: () => void;
  resetGame: () => void;
  clearAIEnding: () => void;
}

const initialLobster: LobsterState = {
  name: '',
  age: 0,
  stage: 1,
  stats: { iq: 50, social: 50, creativity: 50, execution: 50 },
  income: { total: 0, weekly: 0 },
  history: { activities: [], round: 0, maxRounds: 18 },
  conversationHistory: [],
  growthCount: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  lobster: initialLobster,
  isPlaying: false,
  currentFeedback: null,
  currentBackgroundImage: 0,
  isLoading: false,
  shouldShowLegalBreak: false,
  shouldShowForceLegal: false,
  userResponse: '',
  aiEndingTrigger: null,
  aiEndingReason: '',

  startGame: (name) => set({
    isPlaying: true,
    lobster: { ...initialLobster, name },
    shouldShowLegalBreak: false,
    shouldShowForceLegal: false,
    aiEndingTrigger: null,
    aiEndingReason: ''
  }),

  executeActivity: async (activity) => {
    // 清空旧的反馈数据
    set({ isLoading: true, currentFeedback: null });

    try {
      const state = get();
      const { lobster } = state;

      // 调用AI获取反馈
      const prompt = generateFeedbackPrompt({
        lobsterName: lobster.name,
        age: lobster.age,
        activityName: activity.name,
        activityDesc: activity.description,
        stats: lobster.stats,
        conversationHistory: lobster.conversationHistory
      });

      const response = await callAPI(prompt);

      const aiResponse = safeParseJSON(response, {
        feedback: '我完成了这个活动 (´･ω･`)',
        execution: 70,
        growth: { iq: 2, social: 2, creativity: 2, execution: 2 },
        ending: { trigger: false, type: 'normal' as const, reason: '' },
        backgroundImage: 1,
        growUp: false
      });

      console.log('========== 回合结果 ==========');
      console.log(`执行前: 年龄 ${lobster.age} | 轮次 ${lobster.history.round}`);
      console.log(`活动: ${activity.name}`);
      console.log(`执行度: ${aiResponse.execution}`);
      console.log(`成长: IQ+${aiResponse.growth.iq} 社交+${aiResponse.growth.social} 创造+${aiResponse.growth.creativity} 执行+${aiResponse.growth.execution}`);
      console.log(`反馈: ${aiResponse.feedback}`);
      console.log(`结局触发: ${aiResponse.ending?.trigger} | 类型: ${aiResponse.ending?.type} | 理由: ${aiResponse.ending?.reason || '无'}`);
      console.log('================================');

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

      // 检测AI触发的结局
      let aiEndingState = { aiEndingTrigger: null as EndingType | null, aiEndingReason: '' };
      if (aiResponse.ending?.trigger && aiResponse.ending.type) {
        console.log(`⚠️ AI触发结局: ${aiResponse.ending.type}`);
        aiEndingState = {
          aiEndingTrigger: aiResponse.ending.type as EndingType,
          aiEndingReason: aiResponse.ending.reason || ''
        };
      }

      // AI触发的成长：growUp=true 时直接更新阶段
      let newGrowthCount = lobster.growthCount;
      let newAge = lobster.age + 1;
      let newStage: 1 | 2 = lobster.stage;

      if (aiResponse.growUp === true && lobster.growthCount < 3) {
        newGrowthCount = lobster.growthCount + 1;
        console.log(`⚡ AI触发成长: 第${newGrowthCount}次成长`);

        // 根据成长次数更新阶段
        if (newGrowthCount === 1) {
          newAge = 6;  // 第1次成长 → 6岁（儿童）
        } else if (newGrowthCount === 2) {
          newAge = 12; // 第2次成长 → 12岁（青少年）
        } else if (newGrowthCount >= 3) {
          newStage = 2; // 第3次成长 → 进入阶段2（18岁成人）
          newAge = 18;
        }
      }

      set({
        lobster: {
          ...lobster,
          stats: newStats,
          income: newIncome,
          age: newAge,
          stage: newStage,
          growthCount: newGrowthCount,
          history: {
            ...lobster.history,
            activities: [...lobster.history.activities, activity.name],
            round: newRound
          },
          conversationHistory: [...lobster.conversationHistory, newConversation]
        },
        currentFeedback: aiResponse,
        currentBackgroundImage: aiResponse.backgroundImage || 1,
        isLoading: false,
        ...aiEndingState
      });
    } catch (error) {
      console.error('执行失败:', error);
      const state = get();
      const { lobster } = state;

      // 降级方案：使用预设模板
      const activityType = getActivityType(activity.name);
      const fallbackResponse = {
        ...getRandomFeedback(activityType),
        ending: { trigger: false, type: 'normal' as const, reason: '' },
        backgroundImage: 1
      };

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
        currentBackgroundImage: fallbackResponse.backgroundImage || 1,
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
    // 阶段1后期（round 15-17，age 15-17）触发法人突破
    // 这是龙虾主动提出的，模拟"想要独立"的心理
    if (lobster.stage === 1 && lobster.history.round >= 15 && lobster.history.round <= 17) {
      set({ shouldShowLegalBreak: true });
      return true;
    }
    return false;
  },

  checkForceLegal: () => {
    const state = get();
    const { lobster } = state;
    // 阶段1结束时（18轮后）强制进入阶段2
    // 如果之前没有主动突破，就强制进入
    if (lobster.stage === 1 && lobster.history.round >= lobster.history.maxRounds) {
      return true;
    }
    return false;
  },

  // 检测AI触发的结局
  checkAIEnding: () => {
    const state = get();
    const { aiEndingTrigger } = state;
    // 如果AI触发了立即结局（lost/shattered），返回true
    if (aiEndingTrigger && isImmediateEnding(aiEndingTrigger)) {
      return true;
    }
    return false;
  },

  // 设置AI触发的结局（反思页用）
  setAIEnding: (type: EndingType, reason = '') => {
    console.log(`⚠️ 反思页AI触发结局: ${type}`);
    set({
      aiEndingTrigger: type,
      aiEndingReason: reason
    });
  },

  dismissLegalBreak: () => set({ shouldShowLegalBreak: false }),

  canEnterEnding: () => {
    const state = get();
    const { lobster } = state;

    // 阶段1：达到最大轮次（18轮，age 17后进入阶段2）
    if (lobster.stage === 1 && lobster.history.round >= lobster.history.maxRounds) {
      return true;
    }

    // 阶段2：额外4轮后结束（共22轮）
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
        reason: `走过了 ${lobster.age} 年的成长时光，它即将成年`
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
    aiEndingTrigger: null,
    aiEndingReason: ''
  }),

  clearAIEnding: () => set({ aiEndingTrigger: null, aiEndingReason: '' })
}));
