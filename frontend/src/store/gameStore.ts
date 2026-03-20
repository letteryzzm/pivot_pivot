import { create } from 'zustand';
import type { LobsterState, Activity, FeedbackResponse, EndingType } from '../types/game';
import { applyAIGrowth, calculateIncome } from '../game/gameEngine';
import { callAPI, safeParseJSON } from '../utils/api';
import { generateFeedbackPrompt, generateEndingTypePrompt } from '../utils/prompts';
import { getRandomFeedback, getActivityType } from '../game/feedbackTemplates';
import { isImmediateEnding } from '../game/endings';

interface GameStore {
  lobster: LobsterState;
  isPlaying: boolean;
  currentFeedback: FeedbackResponse | null;
  feedbackBackgroundImage: number;    // 反馈页背景 (1-8)
  reflectionBackgroundImage: number;   // 反思页背景 (1-19)
  isLoading: boolean;
  shouldShowLegalBreak: boolean;
  shouldShowForceLegal: boolean;
  userResponse: string;

  // 反思页触发的结局
  reflectionEnding: { trigger: boolean; type: EndingType | null; reason: string } | null;

  // AI触发的结局类型（用于轮次触发时）
  aiGeneratedEnding: { type: EndingType; reason: string } | null;
  isGeneratingEnding: boolean;

  startGame: (name: string) => void;
  executeActivity: (activity: Activity) => Promise<void>;
  setUserResponse: (response: string) => void;
  updateConversationWithReflection: (reflection: string) => void;
  addIncome: (amount: number) => void;
  nextStage: () => void;
  checkLegalBreak: () => boolean;
  checkForceLegal: () => boolean;
  checkAIEnding: () => boolean;
  setReflectionEnding: (ending: { trigger: boolean; type: EndingType | null; reason: string }) => void;
  canEnterEnding: () => boolean;
  getEndingTrigger: () => { stage: number; round: number; reason: string } | null;
  generateAIEnding: () => Promise<void>;
  dismissLegalBreak: () => void;
  resetGame: () => void;
}

const initialLobster: LobsterState = {
  name: '',
  age: 0,
  stage: 1,
  stats: { iq: 50, social: 50, creativity: 50, execution: 50 },
  income: { total: 0, weekly: 0 },
  history: { activities: [], round: 0, maxRounds: 6 },
  conversationHistory: [],
  growthCount: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  lobster: initialLobster,
  isPlaying: false,
  currentFeedback: null,
  feedbackBackgroundImage: 0,
  reflectionBackgroundImage: 0,
  isLoading: false,
  shouldShowLegalBreak: false,
  shouldShowForceLegal: false,
  userResponse: '',
  reflectionEnding: null,
  aiGeneratedEnding: null,
  isGeneratingEnding: false,

  startGame: (name) => set({
    isPlaying: true,
    lobster: { ...initialLobster, name },
    shouldShowLegalBreak: false,
    shouldShowForceLegal: false,
    reflectionEnding: null,
    feedbackBackgroundImage: 0,
    reflectionBackgroundImage: 0,
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
        stage: lobster.stage,
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
        backgroundImage: 1,
        reflectionBackground: 1,
        growUp: false
      });

      console.log('========== 回合结果 ==========');
      console.log(`执行前: 年龄 ${lobster.age} | 轮次 ${lobster.history.round}`);
      console.log(`活动: ${activity.name}`);
      console.log(`执行度: ${aiResponse.execution}`);
      console.log(`成长: IQ+${aiResponse.growth.iq} 社交+${aiResponse.growth.social} 创造+${aiResponse.growth.creativity} 执行+${aiResponse.growth.execution}`);
      console.log(`反馈: ${aiResponse.feedback}`);
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

      // AI触发的成长：growUp=true 时直接更新阶段
      let newGrowthCount = lobster.growthCount;
      let newAge = lobster.age + 1;
      let newStage: 1 | 2 = lobster.stage;

      if (aiResponse.growUp === true && lobster.growthCount < 3) {
        newGrowthCount = lobster.growthCount + 1;
        console.log(`⚡ AI触发成长: 第${newGrowthCount}次成长`);

        // 根据成长次数更新阶段
        if (newGrowthCount === 1) {
          newAge = 6;  // 第1次成长 → 6岁（婴儿）
        } else if (newGrowthCount >= 2) {
          newStage = 2; // 第2次成长 → 进入阶段2（6岁儿童）
          newAge = 6;
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
        feedbackBackgroundImage: aiResponse.backgroundImage || 1,
        reflectionBackgroundImage: aiResponse.reflectionBackground || 1,
        isLoading: false
      });
    } catch (error) {
      console.error('执行失败:', error);
      const state = get();
      const { lobster } = state;

      // 降级方案：使用预设模板
      const activityType = getActivityType(activity.name);
      const fallbackResponse = {
        ...getRandomFeedback(activityType),
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
        feedbackBackgroundImage: fallbackResponse.backgroundImage || 1,
        reflectionBackgroundImage: fallbackResponse.reflectionBackground || 1,
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
    lobster: { ...state.lobster, stage: 2, age: 6 }
  })),

  checkLegalBreak: () => {
    const state = get();
    const { lobster } = state;
    // 阶段1后期（round 4-5，age 4-5）触发法人突破
    // 这是龙虾主动提出的，模拟"想要独立"的心理
    if (lobster.stage === 1 && lobster.history.round >= 4 && lobster.history.round <= 5) {
      set({ shouldShowLegalBreak: true });
      return true;
    }
    return false;
  },

  checkForceLegal: () => {
    const state = get();
    const { lobster } = state;
    // 阶段1结束时（6轮后）强制进入阶段2
    // 如果之前没有主动突破，就强制进入
    if (lobster.stage === 1 && lobster.history.round >= lobster.history.maxRounds) {
      return true;
    }
    return false;
  },

  // 检测反思触发的结局
  checkAIEnding: () => {
    const state = get();
    const { reflectionEnding, lobster } = state;

    // 没有结局触发
    if (!reflectionEnding?.trigger || !reflectionEnding.type) {
      return false;
    }

    // 阶段1（婴儿）：只有 lost/shattered 才立即跳转
    if (lobster.stage === 1) {
      if (isImmediateEnding(reflectionEnding.type)) {
        return true;
      }
      return false;
    }

    // 阶段2（商务/成年）：所有结局类型都立即跳转
    return true;
  },

  // 设置反思触发的结局（反思页用）
  setReflectionEnding: (ending) => {
    console.log(`⚠️ 反思触发结局: ${ending.type} | trigger: ${ending.trigger}`);
    set({ reflectionEnding: ending });
  },

  dismissLegalBreak: () => set({ shouldShowLegalBreak: false }),

  canEnterEnding: () => {
    const state = get();
    const { lobster } = state;

    // 阶段1：达到最大轮次（6轮，age 6后进入阶段2）
    if (lobster.stage === 1 && lobster.history.round >= lobster.history.maxRounds) {
      return true;
    }

    // 阶段2：额外4轮后结束（共10轮）
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
        reason: `走过了婴儿期，它即将进入商务期`
      };
    }

    if (lobster.stage === 2) {
      const stage2Rounds = lobster.history.round - lobster.history.maxRounds;
      if (stage2Rounds >= 4) {
        return {
          stage: 2,
          round: lobster.history.round,
          reason: `经历了 ${stage2Rounds} 轮商务历练`
        };
      }
    }

    if (lobster.age >= 30) {
      return {
        stage: lobster.stage,
        round: lobster.history.round,
        reason: `经历了足够多，是时候回顾总结了`
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
    reflectionEnding: null,
    aiGeneratedEnding: null,
    isGeneratingEnding: false
  }),

  // 生成AI结局类型
  generateAIEnding: async () => {
    const state = get();
    const { lobster, aiGeneratedEnding } = state;

    // 如果已经有AI结局，不重复生成
    if (aiGeneratedEnding) return;

    set({ isGeneratingEnding: true });

    try {
      const prompt = generateEndingTypePrompt({
        lobsterName: lobster.name,
        age: lobster.age,
        stage: lobster.stage,
        stats: lobster.stats,
        income: lobster.income,
        conversationHistory: lobster.conversationHistory
      });

      const response = await callAPI(prompt);

      const parsed = safeParseJSON(response, {
        type: 'normal' as EndingType,
        reason: 'AI总结的结局'
      });

      // 验证type是有效的EndingType
      const validTypes: EndingType[] = ['legal', 'cyborg', 'hermit', 'loop', 'shattered', 'child', 'normal', 'lost'];
      const isValid = validTypes.includes(parsed.type);

      set({
        aiGeneratedEnding: isValid ? { type: parsed.type, reason: parsed.reason } : null,
        isGeneratingEnding: false
      });
    } catch (error) {
      console.error('生成AI结局失败:', error);
      set({ isGeneratingEnding: false });
    }
  }
}));
