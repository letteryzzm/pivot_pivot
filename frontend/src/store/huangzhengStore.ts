import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { HzScenario, HzTag } from '../game/huangzheng-scenarios.ts'
import { HUANGZHENG_SCENARIOS, HZ_TAGS } from '../game/huangzheng-scenarios.ts'

export interface HzChoiceRecord {
  scenarioId: number
  userChoiceId: string
  huangzhengChoiceId: string
  isMatch: boolean
  tag: HzTag
}

interface HuangzhengState {
  currentQuestion: number
  isPlaying: boolean
  isFinished: boolean
  phase: 'choose' | 'reveal'
  choices: HzChoiceRecord[]
  currentUserChoice: string | null
  scenarios: HzScenario[]
  _hasHydrated: boolean

  startQuiz: () => void
  makeChoice: (choiceId: string) => void
  nextQuestion: () => void
  reset: () => void
}

export const useHuangzhengStore = create<HuangzhengState>()(
  persist(
    (set, get) => ({
      currentQuestion: 0,
      isPlaying: false,
      isFinished: false,
      phase: 'choose',
      choices: [],
      currentUserChoice: null,
      scenarios: HUANGZHENG_SCENARIOS,
      _hasHydrated: false,

      startQuiz: () => {
        set({
          currentQuestion: 0,
          isPlaying: true,
          isFinished: false,
          phase: 'choose',
          choices: [],
          currentUserChoice: null,
        })
      },

      makeChoice: (choiceId: string) => {
        const { currentQuestion, scenarios } = get()
        const scenario = scenarios[currentQuestion]
        set({
          currentUserChoice: choiceId,
          phase: 'reveal',
          choices: [
            ...get().choices,
            {
              scenarioId: scenario.id,
              userChoiceId: choiceId,
              huangzhengChoiceId: scenario.huangzhengChoice,
              isMatch: choiceId === scenario.huangzhengChoice,
              tag: scenario.tag,
            },
          ],
        })
      },

      nextQuestion: () => {
        const { currentQuestion, scenarios } = get()
        if (currentQuestion >= scenarios.length - 1) {
          set({ isFinished: true })
        } else {
          set({
            currentQuestion: currentQuestion + 1,
            phase: 'choose',
            currentUserChoice: null,
          })
        }
      },

      reset: () => {
        set({
          currentQuestion: 0,
          isPlaying: false,
          isFinished: false,
          phase: 'choose',
          choices: [],
          currentUserChoice: null,
        })
      },
    }),
    {
      name: 'hz-quiz-state',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentQuestion: state.currentQuestion,
        isPlaying: state.isPlaying,
        isFinished: state.isFinished,
        phase: state.phase,
        choices: state.choices,
        currentUserChoice: state.currentUserChoice,
      }),
      onRehydrateStorage: () => () => {
        useHuangzhengStore.setState({ _hasHydrated: true })
      },
    },
  ),
)

/** Compute summary stats from choices */
export function computeHzSummary(choices: HzChoiceRecord[]) {
  const totalMatch = choices.filter((c) => c.isMatch).length
  const totalQuestions = choices.length

  // Per-tag stats
  const tagStats: Record<HzTag, { match: number; total: number }> = {
    '长期主义': { match: 0, total: 0 },
    '价值取舍': { match: 0, total: 0 },
    '认知深度': { match: 0, total: 0 },
    '格局胆识': { match: 0, total: 0 },
    '社会使命': { match: 0, total: 0 },
  }

  for (const choice of choices) {
    tagStats[choice.tag].total += 1
    if (choice.isMatch) {
      tagStats[choice.tag].match += 1
    }
  }

  // Find most/least aligned tags
  const tagEntries = Object.entries(tagStats)
    .filter(([, v]) => v.total > 0)
    .map(([tag, v]) => ({
      tag: tag as HzTag,
      rate: v.match / v.total,
      match: v.match,
      total: v.total,
      ...HZ_TAGS[tag as HzTag],
    }))
    .sort((a, b) => b.rate - a.rate)

  const mostAligned = tagEntries[0]
  const leastAligned = tagEntries[tagEntries.length - 1]

  return {
    totalMatch,
    totalQuestions,
    matchRate: totalMatch / totalQuestions,
    tagStats,
    tagEntries,
    mostAligned,
    leastAligned,
  }
}
