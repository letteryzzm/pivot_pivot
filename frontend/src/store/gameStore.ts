import { create } from 'zustand'
import type {
  PlayerStats,
  PlayerPath,
  ChoiceRecord,
  GameResult,
  Choice,
  Scenario,
} from '../types/game.ts'
import { INITIAL_STATS, applyEffects, generateResult, generateBridge } from '../game/engine.ts'
import { generateScenarios, generateScenariosFromPool, TOTAL_ROUNDS } from '../game/scenarios.ts'
import { EXPLORING_POOL } from '../game/scenarios-exploring.ts'
import { READY_POOL } from '../game/scenarios-ready.ts'
import { STARTED_POOL } from '../game/scenarios-started.ts'
import { trackGameStart, trackChoice, trackGameEnd } from '../utils/tracker.ts'

const PATH_POOLS = {
  exploring: EXPLORING_POOL,
  ready: READY_POOL,
  started: STARTED_POOL,
} as const

interface GameStore {
  playerName: string
  playerPath: PlayerPath | null
  stats: PlayerStats
  currentRound: number
  history: readonly ChoiceRecord[]
  result: GameResult | null
  scenarios: Scenario[]
  bridge: string
  choiceTimes: readonly number[]

  isPlaying: boolean
  isFinished: boolean

  setPlayerName: (name: string) => void
  startGame: (name: string, path?: PlayerPath) => void
  makeChoice: (choice: Choice, thinkTime: number) => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  playerName: '',
  playerPath: null,
  stats: { ...INITIAL_STATS },
  currentRound: 0,
  history: [],
  result: null,
  scenarios: [],
  bridge: '',
  choiceTimes: [],
  isPlaying: false,
  isFinished: false,

  setPlayerName: (name: string) => {
    set({ playerName: name })
  },

  startGame: (name: string, path?: PlayerPath) => {
    trackGameStart(name)
    const scenarios = path
      ? generateScenariosFromPool(PATH_POOLS[path])
      : generateScenarios()
    set({
      playerName: name,
      playerPath: path ?? null,
      stats: { ...INITIAL_STATS },
      currentRound: 0,
      history: [],
      result: null,
      scenarios,
      bridge: '',
      choiceTimes: [],
      isPlaying: true,
      isFinished: false,
    })
  },

  makeChoice: (choice: Choice, thinkTime: number) => {
    try {
      const state = get()
      const nextRound = state.currentRound + 1
      const scenario = state.scenarios[state.currentRound]
      if (!scenario) return

      const record: ChoiceRecord = {
        round: nextRound,
        scenarioId: scenario.id,
        choiceId: choice.id,
        effects: choice.effects,
      }

      const newStats = applyEffects(state.stats, choice.effects)
      const newHistory = [...state.history, record]
      const newChoiceTimes = [...state.choiceTimes, thinkTime]

      trackChoice(
        record,
        scenario.title,
        scenario.description.replace(/\{name\}/g, state.playerName),
        choice.text,
        choice.clawReaction.replace(/\{name\}/g, state.playerName),
        thinkTime,
      )

      const isLastRound = nextRound >= TOTAL_ROUNDS

      let nextBridge = ''
      try {
        nextBridge = isLastRound ? '' : generateBridge(choice.effects, state.playerName)
      } catch {
        // bridge generation failure is non-critical
      }

      if (isLastRound) {
        let result
        try {
          result = generateResult(newStats, newHistory, state.scenarios)
        } catch (e) {
          console.error('generateResult failed:', e)
          result = generateResult(newStats, newHistory, [])
        }
        trackGameEnd(newStats, result.score, result.founderType)

        set({
          stats: newStats,
          currentRound: nextRound,
          history: newHistory,
          choiceTimes: newChoiceTimes,
          result,
          bridge: '',
          isFinished: true,
        })
      } else {
        set({
          stats: newStats,
          currentRound: nextRound,
          history: newHistory,
          choiceTimes: newChoiceTimes,
          bridge: nextBridge,
        })
      }
    } catch (e) {
      console.error('makeChoice failed:', e)
    }
  },

  resetGame: () => {
    set({
      playerName: '',
      playerPath: null,
      stats: { ...INITIAL_STATS },
      currentRound: 0,
      history: [],
      result: null,
      scenarios: [],
      bridge: '',
      choiceTimes: [],
      isPlaying: false,
      isFinished: false,
    })
  },
}))
