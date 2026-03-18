import { create } from 'zustand';
import type { LobsterState, Activity } from '../types/game';
import { executeActivity, calculateIncome } from '../game/gameEngine';

interface GameStore {
  lobster: LobsterState;
  isPlaying: boolean;
  currentFeedback: string;

  startGame: (name: string) => void;
  executeActivities: (activities: Activity[]) => void;
  addIncome: (amount: number) => void;
  nextStage: () => void;
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

export const useGameStore = create<GameStore>((set) => ({
  lobster: initialLobster,
  isPlaying: false,
  currentFeedback: '',

  startGame: (name) => set({
    isPlaying: true,
    lobster: { ...initialLobster, name }
  }),

  executeActivities: (activities) => set((state) => {
    let newStats = { ...state.lobster.stats };
    let feedbacks: string[] = [];

    activities.forEach(activity => {
      const result = executeActivity(state.lobster, activity);
      newStats = result.newStats;
      feedbacks.push(result.feedback);
    });

    const newRound = state.lobster.history.round + 1;
    const shouldNextStage = newRound >= state.lobster.history.maxRounds;

    return {
      lobster: {
        ...state.lobster,
        stats: newStats,
        age: state.lobster.age + 1,
        stage: shouldNextStage ? 2 : state.lobster.stage,
        history: {
          ...state.lobster.history,
          activities: [...state.lobster.history.activities, ...activities.map(a => a.id)],
          round: newRound
        }
      },
      currentFeedback: feedbacks.join('\n')
    };
  }),

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

  resetGame: () => set({
    lobster: initialLobster,
    isPlaying: false,
    currentFeedback: ''
  })
}));
