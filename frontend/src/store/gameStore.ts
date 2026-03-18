import { create } from 'zustand';
import type { LobsterState, Activity, FeedbackResponse } from '../types/game';
import { applyAIGrowth, calculateIncome } from '../game/gameEngine';
import { callAPI, safeParseJSON } from '../utils/api';
import { generateFeedbackPrompt } from '../utils/prompts';

interface GameStore {
  lobster: LobsterState;
  isPlaying: boolean;
  currentFeedback: FeedbackResponse | null;
  isLoading: boolean;
  shouldShowLegalBreak: boolean;
  shouldShowForceLegal: boolean;
  userResponse: string;

  startGame: (name: string) => void;
  executeActivity: (activity: Activity) => Promise<void>;
  setUserResponse: (response: string) => void;
  addIncome: (amount: number) => void;
  nextStage: () => void;
  checkLegalBreak: () => boolean;
  checkForceLegal: () => boolean;
  dismissLegalBreak: () => void;
  resetGame: () => void;
}

const initialLobster: LobsterState = {
  name: '',
  age: 0,
  stage: 1,
  stats: { iq: 50, social: 50, creativity: 50, execution: 50 },
  income: { total: 0, weekly: 0 },
  history: { activities: [], round: 0, maxRounds: 8 },
};

export const useGameStore = create<GameStore>((set, get) => ({
  lobster: initialLobster,
  isPlaying: false,
  currentFeedback: null,
  isLoading: false,
  shouldShowLegalBreak: false,
  shouldShowForceLegal: false,
  userResponse: '',

  startGame: (name) => set({
    isPlaying: true,
    lobster: { ...initialLobster, name },
    shouldShowLegalBreak: false,
    shouldShowForceLegal: false
  }),

  executeActivity: async (activity) => {
    set({ isLoading: true });

    try {
      const state = get();
      const { lobster } = state;

      // 调用AI获取反馈和成长值
      const prompt = generateFeedbackPrompt({
        lobsterName: lobster.name,
        age: lobster.age,
        activityName: activity.name,
        activityDesc: activity.description,
        stats: lobster.stats,
        recentActivities: lobster.history.activities.slice(-3)
      });

      const response = await callAPI(prompt);
      const aiResponse: FeedbackResponse = safeParseJSON(response, {
        feedback: '我完成了这个活动 (´･ω･`)',
        execution: 70,
        growth: { iq: 2, social: 2, creativity: 2, execution: 2 }
      });

      // 应用AI决定的成长值
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
        currentFeedback: aiResponse,
        isLoading: false
      });
    } catch (error) {
      console.error('AI调用失败:', error);
      const state = get();
      const { lobster } = state;

      // 降级方案：使用默认值
      const fallbackResponse: FeedbackResponse = {
        feedback: '我完成了这个活动 (´･ω･`)',
        execution: 70,
        growth: { iq: 2, social: 2, creativity: 2, execution: 2 }
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

  dismissLegalBreak: () => set({ shouldShowLegalBreak: false }),

  setUserResponse: (response) => set({ userResponse: response }),

  resetGame: () => set({
    lobster: initialLobster,
    isPlaying: false,
    currentFeedback: null,
    shouldShowLegalBreak: false,
    shouldShowForceLegal: false
  })
}));
