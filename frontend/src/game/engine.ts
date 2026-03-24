import type {
  PlayerStats,
  StatEffect,
  ChoiceRecord,
  FounderType,
  GameResult,
  Scenario,
  DiagnosticBlindSpot,
} from '../types/game.ts'
import { HIDDEN_ENDINGS } from '../types/game.ts'
import type { QuickAnswer } from '../game/quickQuestions.ts'
import { analyzeQuickAnswers } from '../game/quickQuestions.ts'

// ── Bridge generation: connect scenes based on previous choice ──

const BRIDGES: Record<string, readonly string[]> = {
  judgment: [
    '想了几天之后，有些事情开始变得清晰了。',
    '反复琢磨之后，{name}慢慢看懂了一些东西。',
    '这个判断让{name}的思路打开了。',
    '冷静下来之后，{name}发现了之前没注意到的线索。',
  ],
  action: [
    '说干就干。几天后——',
    '{name}没有犹豫太久，事情开始推进了。',
    '行动带来了新的变化。',
    '动起来之后，{name}发现问题比想的清楚多了。',
  ],
  cognition: [
    '这段经历让{name}学到了不少。',
    '认知又更新了一层。接下来——',
    '视野变宽了，新的问题也浮出了水面。',
    '{name}的理解比一周前深了很多。',
  ],
  connection: [
    '和几个人聊过之后，事情有了新的走向。',
    '{name}从别人那里听到了意想不到的反馈。',
    '有人开始注意到{name}在做的事了。',
    '这次对话带来了一些关键信息。',
  ],
  negative: [
    '虽然停了一步，但日子还是在往前走。',
    '那个选择的后果开始显现了。',
    '有些机会悄悄溜走了，但新的局面也在形成。',
    '犹豫的代价慢慢浮出水面。',
  ],
}

export function generateBridge(effects: StatEffect, name: string): string {
  const entries = Object.entries(effects).filter(
    ([, v]) => v !== undefined && v !== 0
  ) as [string, number][]

  // If mostly negative effects, use the "negative" bridges
  const totalEffect = entries.reduce((sum, [, v]) => sum + v, 0)
  if (totalEffect < 0) {
    const pool = BRIDGES.negative
    return pool[Math.floor(Math.random() * pool.length)].replace(/\{name\}/g, name)
  }

  // Find the dominant positive stat
  const positive = entries
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])

  const dominant = positive[0]?.[0] || 'action'
  const pool = BRIDGES[dominant] || BRIDGES.action
  return pool[Math.floor(Math.random() * pool.length)].replace(/\{name\}/g, name)
}

export const INITIAL_STATS: PlayerStats = {
  judgment: 50,
  action: 50,
  cognition: 50,
  connection: 50,
}

const STAT_MIN = 0
const STAT_MAX = 100

function clampStat(value: number): number {
  return Math.max(STAT_MIN, Math.min(STAT_MAX, value))
}

export function applyEffects(
  stats: PlayerStats,
  effects: StatEffect
): PlayerStats {
  return {
    judgment: clampStat(stats.judgment + (effects.judgment ?? 0)),
    action: clampStat(stats.action + (effects.action ?? 0)),
    cognition: clampStat(stats.cognition + (effects.cognition ?? 0)),
    connection: clampStat(stats.connection + (effects.connection ?? 0)),
  }
}

export function calculateScore(stats: PlayerStats): number {
  const avg =
    (stats.judgment + stats.action + stats.cognition + stats.connection) / 4

  const values = [
    stats.judgment,
    stats.action,
    stats.cognition,
    stats.connection,
  ]
  const maxVal = Math.max(...values)
  const minVal = Math.min(...values)
  const spread = maxVal - minVal

  const balanceBonus = spread < 15 ? Math.round((15 - spread) / 3) : 0
  const highBonus = avg > 65 ? Math.min(5, Math.round((avg - 65) / 4)) : 0

  return Math.round(Math.min(100, avg + balanceBonus + highBonus))
}

export function determineFounderType(stats: PlayerStats): FounderType {
  const avg =
    (stats.judgment + stats.action + stats.cognition + stats.connection) / 4

  // Founder: balanced and high
  if (avg >= 68) {
    const values = [
      stats.judgment,
      stats.action,
      stats.cognition,
      stats.connection,
    ]
    const spread = Math.max(...values) - Math.min(...values)
    if (spread < 22) return 'founder'
  }

  const thinkScore = stats.judgment + stats.cognition
  const doScore = stats.action + stats.connection

  // Extreme action dominance = hustler
  if (stats.action >= 75 && stats.judgment < 55) return 'hustler'

  // High judgment + cognition but low action = thinker
  if (thinkScore > doScore + 12) return 'thinker'

  // High action + connection but low thinking = hustler
  if (doScore > thinkScore + 12) return 'hustler'

  // Low overall = observer
  if (avg < 45) return 'observer'

  return 'explorer'
}

// ── Direction 2: Rewritten descriptions (mirror/sting style) ──

const RESULT_PROFILES: Record<
  FounderType,
  { title: string; description: string; advice: string }
> = {
  founder: {
    title: '天生创业者',
    description:
      '你在10轮选择中表现得近乎完美——每一步都兼顾了思考和行动，判断和连接。你总是在信息还不够多的时候就敢做决定，而且决定的方向还基本是对的。说实话，这种平衡感让人不安，因为你看起来太像那种"什么都擅长但还没找到真正值得all-in的事"的人。',
    advice:
      '你已经具备了出发的能力。现在需要的是一个足够大、足够痛的问题。找一个高频痛点，用AI做到10倍改进，两周内做出第一版，立刻找到5个真实用户。记住：创业最宝贵的不是赚钱机会，而是成长密度。',
  },
  thinker: {
    title: '深度思考者',
    description:
      '你在10个选择中把大多数机会都给了"先想清楚"。你的备忘录里大概有15个项目计划，但上线的产品是0个。你不是缺能力，你是害怕做出来之后发现自己错了。你总是在等一个"完美时机"——但那个时机永远不会来，因为你会一直发现新的"还没想清楚的地方"。',
    advice:
      '你缺的不是思考，是行动中的反馈循环。给自己14天：前7天找20个目标用户聊痛点，后7天写一页纸（问题是什么、谁最痛、现在怎么解决、你准备先做什么）。用最土的方法先帮一个人解决一个问题。验证会让你的判断力真正长起来。',
  },
  hustler: {
    title: '极速行动派',
    description:
      '你在10轮里几乎每次都选了"先干再说"。你的行动速度让人佩服，但你有没有注意到，你很少选择那些需要停下来想一想的选项？你不是在创业，你是在用忙碌逃避那个你不敢面对的问题：万一方向从一开始就是错的呢？跑得越快，回头的成本越高。',
    advice:
      '放慢一步问自己：我在解决的问题，痛感真的够强吗？有人愿意为此付代价吗？好问题的五个条件——痛感强、频率高、有人愿付代价、能更早接近用户、切口未来能长大——缺一不可。找20个目标用户深度访谈，让他们的行为而不是言语告诉你答案。',
  },
  explorer: {
    title: '潜力探索者',
    description:
      '你的10轮选择没有明显的偏好——一会儿想多了解一下，一会儿又想直接干。你还在寻找"那个让你愿意连续加班三个月也不觉得累"的事情。你身上有好奇心，但好奇心如果不聚焦，就只是一种消遣。你什么都想尝试，意味着你还没找到那个让你愿意放弃其他所有选项的东西。',
    advice:
      '从一个你身边反复看见的低效场景开始。去不同的城市看看，和优秀的人在一起，写作和反思。学会介绍你自己——讲清楚你是谁、想干什么、有什么不同。然后给自己60天，做一个最小原型，盯三个数：使用、留存、付费意愿。',
  },
  observer: {
    title: '旁观者',
    description:
      '你在10轮选择中，总是选了那个最安全的选项。你不是没有想法，你是选择了不冒险。你看着别人折腾，心里可能在想"我比他们聪明，只是我还没准备好"。但准备好这件事不会发生——它是你给自己找的最体面的借口，用来回避那个真正让你害怕的问题：万一我试了，发现自己其实不行呢？',
    advice:
      '创业不适合所有人，但"开始"适合。找一个让你无法忍受的问题，从一个小实验开始。不需要辞职、不需要all-in，只需要用两周的业余时间做一件事：帮一个真实的人解决一个真实的问题。如果做完之后你停不下来，那就是信号。',
  },
  // Hidden endings
  gambler: {
    title: '赌徒',
    description:
      '你每一轮都选了最激进的那个。要么你真的无所畏惧，要么你根本没在看题。不管哪种，你大概率会成为那个让投资人心跳加速的人。',
    advice:
      '你的胆量是稀缺资源，但赌徒和创业者的区别在于：创业者知道自己在赌什么。找到那个你愿意用三年青春去赌的问题，然后用数据而不是直觉来验证它。',
  },
  prophet: {
    title: '先知',
    description:
      '你在某个维度上达到了近乎变态的专注。这不是均衡发展，这是偏执——而偏执者改变世界。',
    advice:
      '你的极致专注是你最大的武器。找到一个能把这种专注转化为产品的领域，然后找一个和你互补的合伙人来补短板。',
  },
  philosopher: {
    title: '哲学家',
    description:
      '你花了10轮时间思考人生，但几乎没有行动。你的脑子里有一个完美的创业计划，它将永远停留在那里。除非你现在就关掉这个页面去做点什么。',
    advice:
      '你现在最需要的不是更多思考，而是一个48小时冲刺：选一个想法，做一个最丑的原型，发给10个人。不是为了成功，是为了打破"思考-再思考"的死循环。',
  },
  polymath: {
    title: '万能选手',
    description:
      '四个维度全部75+，你是统计学上的异常值。要么你真的是天选之人，要么你只是很会选"看起来正确"的答案。如果是后者——恭喜，你很适合做咨询。',
    advice:
      '你的全面性是罕见的，但创业需要的不是全面，是在一个点上的极致。选择你最强的那个维度，用它作为突破口，其他维度用来支撑。',
  },
}

// ── Direction 4: Hidden ending detection ──

function checkHiddenEnding(
  stats: PlayerStats,
  history: readonly ChoiceRecord[],
  scenarios: readonly { readonly choices: readonly { readonly id: string; readonly effects: StatEffect }[] }[],
): FounderType | null {
  // Gambler: all 10 rounds picked the most aggressive (highest action effect) option
  if (history.length >= 10 && scenarios.length >= 10) {
    const allAggressive = history.every((record, index) => {
      const scenarioChoices = scenarios[index]?.choices
      if (!scenarioChoices || scenarioChoices.length === 0) return false

      const maxAction = Math.max(
        ...scenarioChoices.map((c) => c.effects.action ?? 0)
      )
      const chosenAction = record.effects.action ?? 0
      return chosenAction >= maxAction && maxAction > 0
    })
    if (allAggressive) return 'gambler'
  }

  // Prophet: any single stat >= 95
  const statValues = [stats.judgment, stats.action, stats.cognition, stats.connection]
  if (statValues.some((v) => v >= 95)) return 'prophet'

  // Polymath: all four stats > 75
  if (statValues.every((v) => v > 75)) return 'polymath'

  // Philosopher: action <= 30
  if (stats.action <= 30) return 'philosopher'

  return null
}

// ── Direction 1: Decision Fingerprints ──

const STAT_KEYS: readonly (keyof PlayerStats)[] = [
  'judgment',
  'action',
  'cognition',
  'connection',
]

const STAT_NAMES: Record<keyof PlayerStats, string> = {
  judgment: '判断力',
  action: '行动力',
  cognition: '认知',
  connection: '连接力',
}

export function generateFingerprints(
  history: readonly ChoiceRecord[],
  stats: PlayerStats
): string[] {
  const fingerprints: string[] = []

  if (history.length === 0) return fingerprints

  // 1. Dominant stat pattern
  const effectTotals: Record<keyof PlayerStats, number> = {
    judgment: 0,
    action: 0,
    cognition: 0,
    connection: 0,
  }
  for (const record of history) {
    for (const key of STAT_KEYS) {
      effectTotals[key] += record.effects[key] ?? 0
    }
  }

  const sortedStats = [...STAT_KEYS].sort(
    (a, b) => effectTotals[b] - effectTotals[a]
  )
  const dominant = sortedStats[0]

  const dominantFingerprints: Record<keyof PlayerStats, string> = {
    action: '在信息不完整时选择行动',
    cognition: '决策前先构建完整认知',
    judgment: '用独立判断过滤噪音',
    connection: '通过人脉网络获取关键信息',
  }
  fingerprints.push(dominantFingerprints[dominant])

  // 2. Risk pattern: count rounds with net negative or high-variance effects
  const roundRisks = history.map((record) => {
    const vals = STAT_KEYS.map((k) => record.effects[k] ?? 0)
    const hasNegative = vals.some((v) => v < 0)
    const maxPositive = Math.max(...vals)
    return { hasNegative, maxPositive, total: vals.reduce((a, b) => a + b, 0) }
  })

  const highRiskRounds = roundRisks.filter(
    (r) => r.hasNegative && r.maxPositive >= 5
  ).length
  const consecutiveHighRisk = countMaxConsecutive(
    roundRisks.map((r) => r.maxPositive >= 5)
  )

  if (consecutiveHighRisk >= 3) {
    fingerprints.push('面对不确定性时加倍下注')
  } else if (highRiskRounds >= 5) {
    fingerprints.push('愿意用短期损失换长期收益')
  } else if (highRiskRounds <= 2) {
    fingerprints.push('倾向于选择确定性高的路径')
  } else {
    fingerprints.push('在风险和安全之间反复权衡')
  }

  // 3. Strategy shift: compare first half vs second half style
  const midpoint = Math.floor(history.length / 2)
  const firstHalf = history.slice(0, midpoint)
  const secondHalf = history.slice(midpoint)

  const firstDominant = getDominantStat(firstHalf)
  const secondDominant = getDominantStat(secondHalf)

  if (firstDominant !== secondDominant) {
    fingerprints.push(
      `前期侧重${STAT_NAMES[firstDominant]}，后期转向${STAT_NAMES[secondDominant]}`
    )
  } else {
    // Check if the weakest stat improved
    const weakest = sortedStats[sortedStats.length - 1]
    const weakestVal = stats[weakest]
    if (weakestVal >= 55) {
      fingerprints.push('不放弃任何一个维度的成长')
    } else {
      fingerprints.push(`始终坚持${STAT_NAMES[dominant]}优先的策略`)
    }
  }

  return fingerprints.slice(0, 3)
}

function getDominantStat(records: readonly ChoiceRecord[]): keyof PlayerStats {
  const totals: Record<keyof PlayerStats, number> = {
    judgment: 0,
    action: 0,
    cognition: 0,
    connection: 0,
  }
  for (const record of records) {
    for (const key of STAT_KEYS) {
      totals[key] += record.effects[key] ?? 0
    }
  }
  return STAT_KEYS.reduce((best, key) =>
    totals[key] > totals[best] ? key : best
  )
}

function countMaxConsecutive(bools: boolean[]): number {
  let max = 0
  let current = 0
  for (const b of bools) {
    if (b) {
      current += 1
      max = Math.max(max, current)
    } else {
      current = 0
    }
  }
  return max
}

export function calculatePercentile(score: number): number {
  if (score >= 85) return 95
  if (score >= 75) return 85
  if (score >= 65) return 70
  if (score >= 55) return 50
  if (score >= 45) return 30
  return 15
}

// ── Diagnostic Analysis from Scenario Choices ──

export function analyzeChoicesForDiagnosis(
  history: readonly ChoiceRecord[],
  scenarios: readonly Scenario[]
): {
  recommendedSources: readonly number[]
  blindSpots: readonly DiagnosticBlindSpot[]
  stageSignal: string
} {
  // Collect all sourceIds from chosen options and count frequency
  const sourceFrequency: Record<number, number> = {}
  const allTags: Record<string, string>[] = []

  for (const record of history) {
    const scenario = scenarios.find((s) => s.id === record.round)
    if (!scenario) continue

    const chosenChoice = scenario.choices.find((c) => c.id === record.choiceId)
    if (!chosenChoice) continue

    // Collect sourceIds
    const ids = chosenChoice.sourceIds ?? []
    for (const id of ids) {
      sourceFrequency[id] = (sourceFrequency[id] ?? 0) + 1
    }

    // Collect diagnostic tags
    if (chosenChoice.diagnosticTags) {
      allTags.push(chosenChoice.diagnosticTags)
    }
  }

  // Top 8 most frequent sourceIds
  const sortedSources = Object.entries(sourceFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => Number(id))
    .slice(0, 8)

  // Detect blind spots from diagnostic tags
  const blindSpots = detectBlindSpots(allTags)

  // Detect stage signal
  const stageSignal = detectStageSignal(allTags)

  return {
    recommendedSources: sortedSources,
    blindSpots,
    stageSignal,
  }
}

function collectTagValues(
  tags: readonly Record<string, string>[],
  key: string
): string[] {
  const values: string[] = []
  for (const tag of tags) {
    if (tag[key] !== undefined) {
      values.push(tag[key])
    }
  }
  return values
}

function detectBlindSpots(
  tags: readonly Record<string, string>[]
): DiagnosticBlindSpot[] {
  const spots: DiagnosticBlindSpot[] = []

  const actionLevels = collectTagValues(tags, 'action_level')
  const passiveCount = actionLevels.filter((v) => v === 'passive').length
  if (passiveCount > 0 && passiveCount >= actionLevels.length / 2) {
    spots.push({
      title: '你倾向于观望而不是行动',
      description: '创业最大的风险不是失败，而是从来没有开始。风险不会因为等待而降低，只会因为错过而放大。',
      sourceIds: [2, 6],
    })
  }

  const executions = collectTagValues(tags, 'execution')
  if (executions.includes('perfectionist')) {
    spots.push({
      title: '完美主义是行动的最大敌人',
      description: '先做最小版本，丑就丑，能用就行。很多年轻创业者死在第一款产品想太大、做太大。',
      sourceIds: [2],
    })
  }

  const validations = collectTagValues(tags, 'validation')
  const hasDeskResearch = validations.includes('desk-research')
  const hasDirectUser = validations.includes('direct-user')
  if (hasDeskResearch && !hasDirectUser) {
    spots.push({
      title: '你在猜用户要什么而不是去问',
      description: '市场报告不等于用户需求。去找20个不认识的目标用户，问他们现在为这个问题花了多少时间和钱。',
      sourceIds: [1],
    })
  }

  const failures = collectTagValues(tags, 'failure')
  const resiliences = collectTagValues(tags, 'resilience')
  if (failures.includes('quit') || resiliences.includes('quit')) {
    spots.push({
      title: '创业公司死因只有一个：创始人放弃',
      description: '大多数创业公司不是因为没钱死的，而是因为创始人心理崩溃。只要你不死就能成功。',
      sourceIds: [30],
    })
  }

  const teams = collectTagValues(tags, 'team')
  const commitments = collectTagValues(tags, 'commitment')
  if (teams.includes('solo') && commitments.includes('all-in')) {
    spots.push({
      title: '一个人可以开始，但很难走远',
      description: '找到一个信任你且和你互补的合伙人。创业最孤独的时刻，需要有人分担。',
      sourceIds: [15, 25],
    })
  }

  const adaptations = collectTagValues(tags, 'adaptation')
  if (adaptations.includes('panic')) {
    spots.push({
      title: '唯一不会被复制的，是你嵌进了用户的工作',
      description: '大模型可以复制功能，但复制不了你对用户工作流的深度理解。做那30%AI做不了的。',
      sourceIds: [31, 32],
    })
  }

  return spots.slice(0, 4)
}

function detectStageSignal(
  tags: readonly Record<string, string>[]
): string {
  const commitments = collectTagValues(tags, 'commitment')
  const executions = collectTagValues(tags, 'execution')
  const failures = collectTagValues(tags, 'failure')

  // If mostly deferred commitment, probably in idea stage
  const deferredCount = commitments.filter((v) => v === 'deferred').length
  if (deferredCount > 0 && deferredCount >= commitments.length / 2) {
    return 'idea'
  }

  // If has execution choices, at least in build stage
  if (executions.length > 0) {
    const hasSellFirst = executions.includes('sell-first')
    const hasShipFast = executions.includes('ship-fast') || executions.includes('manual-first')

    if (hasSellFirst) return 'validate'
    if (hasShipFast) return 'build'
  }

  // If dealing with failure, in survive stage
  if (failures.includes('quit') || failures.includes('diagnose')) {
    return 'survive'
  }

  // Default
  return 'build'
}

// ── Main Result Generation ──

export function generateResult(
  stats: PlayerStats,
  history: readonly ChoiceRecord[],
  scenarios?: readonly Scenario[],
  quickAnswers?: readonly QuickAnswer[],
): GameResult {
  // Direction 4: check hidden endings first (higher priority)
  const hiddenType = checkHiddenEnding(stats, history, scenarios ?? [])
  const founderType = hiddenType ?? determineFounderType(stats)

  const score = calculateScore(stats)
  const percentile = calculatePercentile(score)
  const profile = RESULT_PROFILES[founderType]

  // Direction 1: generate fingerprints
  const fingerprints = generateFingerprints(history, stats)

  // Diagnostic analysis
  const diagnosis = analyzeChoicesForDiagnosis(history, scenarios ?? [])

  // Quick question analysis
  const quickAnalysis = quickAnswers && quickAnswers.length > 0
    ? analyzeQuickAnswers(quickAnswers)
    : undefined

  return {
    founderType,
    stats,
    score,
    percentile,
    isHidden: HIDDEN_ENDINGS.has(founderType),
    fingerprints,
    recommendedSources: diagnosis.recommendedSources,
    blindSpots: diagnosis.blindSpots,
    stageSignal: diagnosis.stageSignal,
    quickAnalysis,
    ...profile,
  }
}

export function generateResultPrompt(
  playerName: string,
  stats: PlayerStats,
  history: readonly ChoiceRecord[],
  result: GameResult
): string {
  const choiceSummary = history
    .map((r) => `第${r.round}轮选了${r.choiceId}`)
    .join('，')

  return `你是一位资深创业导师和天使投资人，见过上万名年轻创业者。一个叫"${playerName}"的年轻人刚完成了一个创业模拟。

四维能力：判断力${stats.judgment}，行动力${stats.action}，认知${stats.cognition}，连接力${stats.connection}。
选择路径：${choiceSummary}。
创业者类型：${result.title}。

请用2-3句话给一段个性化寄语。要求：
- 像一个看过6000+年轻创业者的前辈在聊天
- 指出一个具体的选择模式（好的或需要注意的）
- 语气温暖但真实，不说空话
- 中文，不超过100字`
}
