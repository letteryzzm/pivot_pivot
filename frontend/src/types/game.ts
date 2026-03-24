export interface PlayerStats {
  judgment: number
  action: number
  cognition: number
  connection: number
}

export interface StatEffect {
  judgment?: number
  action?: number
  cognition?: number
  connection?: number
}

export interface Choice {
  id: string
  text: string
  effects: StatEffect
  clawReaction: string
  // Diagnostic mapping
  sourceIds?: readonly number[]
  diagnosticTags?: Record<string, string>
}

export interface Scenario {
  id: number
  title: string
  description: string
  choices: Choice[]
}

export interface ChoiceRecord {
  round: number
  scenarioId: number
  choiceId: string
  effects: StatEffect
}

export type PlayerPath = 'exploring' | 'ready' | 'started'

export type FounderType =
  | 'founder'
  | 'thinker'
  | 'hustler'
  | 'explorer'
  | 'observer'
  | 'gambler'
  | 'prophet'
  | 'philosopher'
  | 'polymath'

export const HIDDEN_ENDINGS: ReadonlySet<FounderType> = new Set([
  'gambler',
  'prophet',
  'philosopher',
  'polymath',
])

export interface DiagnosticBlindSpot {
  readonly title: string
  readonly description: string
  readonly sourceIds: readonly number[]
}

export interface QuickAnalysis {
  readonly categoryScores: Record<string, { readonly total: number; readonly count: number; readonly avg: number }>
  readonly weakCategories: readonly string[]
  readonly strongCategories: readonly string[]
  readonly totalScore: number
  readonly maxScore: number
  readonly highlightedQuestions: readonly { readonly questionId: number; readonly score: number; readonly category: string }[]
}

export interface GameResult {
  founderType: FounderType
  stats: PlayerStats
  score: number
  percentile: number
  title: string
  description: string
  advice: string
  isHidden: boolean
  fingerprints: string[]
  // Diagnostic output
  recommendedSources: readonly number[]
  blindSpots: readonly DiagnosticBlindSpot[]
  stageSignal: string
  // Quick question analysis
  quickAnalysis?: QuickAnalysis
}
