import type { PlayerStats, ChoiceRecord, FounderType } from '../types/game.ts'

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || ''

export function getSessionId(): string {
  const key = 'pivot_session_id'
  const existing = sessionStorage.getItem(key)
  if (existing) return existing

  const id = crypto.randomUUID()
  sessionStorage.setItem(key, id)
  return id
}

async function supabaseInsert(
  table: string,
  data: Record<string, unknown>
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(data),
    })
  } catch {
    // Silently fail - tracking should not break the game
  }
}

export async function trackGameStart(playerName: string): Promise<void> {
  await supabaseInsert('game_sessions', {
    session_id: getSessionId(),
    player_name: playerName,
    started_at: new Date().toISOString(),
  })
}

export async function trackChoice(
  record: ChoiceRecord,
  scenarioTitle?: string,
  scenarioDesc?: string,
  choiceText?: string,
  clawReaction?: string,
): Promise<void> {
  await supabaseInsert('game_choices', {
    session_id: getSessionId(),
    round: record.round,
    scenario_id: record.scenarioId,
    choice_id: record.choiceId,
    effects: record.effects,
    scenario_title: scenarioTitle || '',
    scenario_desc: scenarioDesc || '',
    choice_text: choiceText || '',
    claw_reaction: clawReaction || '',
    chosen_at: new Date().toISOString(),
  })
}

export async function trackGameEnd(
  stats: PlayerStats,
  score: number,
  founderType: FounderType
): Promise<void> {
  await supabaseInsert('game_results', {
    session_id: getSessionId(),
    final_stats: stats,
    score,
    founder_type: founderType,
    finished_at: new Date().toISOString(),
  })
}

/** Query real percentile from all historical game_results */
export async function fetchPercentile(score: number): Promise<{
  percentile: number
  totalPlayers: number
  beatCount: number
}> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { percentile: 50, totalPlayers: 0, beatCount: 0 }
  }

  try {
    // Count total finished games
    const totalRes = await fetch(
      `${SUPABASE_URL}/rest/v1/game_results?select=score`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    )
    if (!totalRes.ok) throw new Error('fetch failed')

    const allScores: { score: number }[] = await totalRes.json()
    const totalPlayers = allScores.length
    if (totalPlayers === 0) {
      return { percentile: 50, totalPlayers: 0, beatCount: 0 }
    }

    const beatCount = allScores.filter((r) => r.score < score).length
    const percentile = Math.round((beatCount / totalPlayers) * 100)

    return { percentile, totalPlayers, beatCount }
  } catch {
    return { percentile: 50, totalPlayers: 0, beatCount: 0 }
  }
}
