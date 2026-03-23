import { create } from 'zustand'
import type {
  PlayerStats,
  ChoiceRecord,
  GameResult,
  Choice,
  Scenario,
} from '../types/game.ts'
import { INITIAL_STATS, applyEffects, generateResult, generateBridge } from '../game/engine.ts'
import { generateScenarios, TOTAL_ROUNDS } from '../game/scenarios.ts'
import { trackGameStart, trackChoice, trackGameEnd } from '../utils/tracker.ts'

interface GameStore {
  playerName: string
  stats: PlayerStats
  currentRound: number
  history: readonly ChoiceRecord[]
  result: GameResult | null
  scenarios: Scenario[]
  bridge: string

  isPlaying: boolean
  isFinished: boolean

  startGame: (name: string) => void
  makeChoice: (choice: Choice) => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  playerName: '',
  stats: { ...INITIAL_STATS },
  currentRound: 0,
  history: [],
  result: null,
  scenarios: [],
  bridge: '',
  isPlaying: false,
  isFinished: false,

  startGame: (name: string) => {
    trackGameStart(name)
    set({
      playerName: name,
      stats: { ...INITIAL_STATS },
      currentRound: 0,
      history: [],
      result: null,
      scenarios: generateScenarios(),
      bridge: '',
      isPlaying: true,
      isFinished: false,
    })
  },

  makeChoice: (choice: Choice) => {
    const state = get()
    const nextRound = state.currentRound + 1
    const scenario = state.scenarios[state.currentRound]

    const record: ChoiceRecord = {
      round: nextRound,
      scenarioId: scenario.id,
      choiceId: choice.id,
      effects: choice.effects,
    }

    const newStats = applyEffects(state.stats, choice.effects)
    const newHistory = [...state.history, record]

    trackChoice(record)

    const isLastRound = nextRound >= TOTAL_ROUNDS

    const nextBridge = isLastRound
      ? ''
      : generateBridge(choice.effects, state.playerName)

    if (isLastRound) {
      const result = generateResult(newStats, newHistory)
      trackGameEnd(newStats, result.score, result.founderType)

      set({
        stats: newStats,
        currentRound: nextRound,
        history: newHistory,
        result,
        bridge: '',
        isFinished: true,
      })
    } else {
      set({
        stats: newStats,
        currentRound: nextRound,
        history: newHistory,
        bridge: nextBridge,
      })
    }
  },

  resetGame: () => {
    set({
      playerName: '',
      stats: { ...INITIAL_STATS },
      currentRound: 0,
      history: [],
      result: null,
      scenarios: [],
      bridge: '',
      isPlaying: false,
      isFinished: false,
    })
  },
}))
