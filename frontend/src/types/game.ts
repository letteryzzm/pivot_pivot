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

export type FounderType = 'founder' | 'thinker' | 'hustler' | 'explorer' | 'observer'

export interface GameResult {
  founderType: FounderType
  stats: PlayerStats
  score: number
  percentile: number
  title: string
  description: string
  advice: string
}
