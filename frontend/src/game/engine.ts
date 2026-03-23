import type {
  PlayerStats,
  StatEffect,
  ChoiceRecord,
  FounderType,
  GameResult,
} from '../types/game.ts'

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

const RESULT_PROFILES: Record<
  FounderType,
  { title: string; description: string; advice: string }
> = {
  founder: {
    title: '天生创业者',
    description:
      '你展现了极高的结构外生长力——不需要外部压力就能自我驱动、独立判断、持续行动。你能在信息不完整时做出判断，在所有人说不行的时候继续往前走，同时还保持着对人和现实的敏锐感知。这是投资人最想在20岁年轻人身上看到的特质。',
    advice:
      '你已经具备了出发的能力。现在需要的是一个足够大、足够痛的问题。找一个高频痛点，用AI做到10倍改进，两周内做出第一版，立刻找到5个真实用户。记住：创业最宝贵的不是赚钱机会，而是成长密度。',
  },
  thinker: {
    title: '深度思考者',
    description:
      '你的判断力和认知深度远超同龄人，能看到别人看不到的东西，善于从第一性原理思考问题。但你可能被"想清楚再开始"困住了。认知 = 输入 x 判断 x 验证——没有验证的判断只是假设，不管它多漂亮。',
    advice:
      '你缺的不是思考，是行动中的反馈循环。给自己14天：前7天找20个目标用户聊痛点，后7天写一页纸（问题是什么、谁最痛、现在怎么解决、你准备先做什么）。用最土的方法先帮一个人解决一个问题。验证会让你的判断力真正长起来。',
  },
  hustler: {
    title: '极速行动派',
    description:
      '你行动力惊人，敢在两三成把握时就起飞，边飞边造引擎。这种"先开枪再瞄准"的本能是稀缺的。但方向错了，跑得越快偏得越远。创业不是比速度，是比谁更早接近真相。',
    advice:
      '放慢一步问自己：我在解决的问题，痛感真的够强吗？有人愿意为此付代价吗？好问题的五个条件——痛感强、频率高、有人愿付代价、能更早接近用户、切口未来能长大——缺一不可。找20个目标用户深度访谈，让他们的行为而不是言语告诉你答案。',
  },
  explorer: {
    title: '潜力探索者',
    description:
      '你正在寻找自己的节奏和方向，四维能力各有特色。你身上有创业者的火苗——你对世界的不满足、对问题的好奇心，都是珍贵的原材料。创业天才不是一开始就强大的，他们也会犹豫和害怕，但他们不逃。',
    advice:
      '从一个你身边反复看见的低效场景开始。去不同的城市看看，和优秀的人在一起，写作和反思。学会介绍你自己——讲清楚你是谁、想干什么、有什么不同。然后给自己60天，做一个最小原型，盯三个数：使用、留存、付费意愿。',
  },
  observer: {
    title: '旁观者',
    description:
      '你倾向于在安全边界内做选择，回避不确定性和冲突。这不是缺点——大部分人都是这样。但如果你内心深处有什么东西在不安分，那值得认真对待。很多改变世界的人，不是一开始就很厉害，而是在某个时刻选择了不再旁观。',
    advice:
      '创业不适合所有人，但"开始"适合。找一个让你无法忍受的问题，从一个小实验开始。不需要辞职、不需要all-in，只需要用两周的业余时间做一件事：帮一个真实的人解决一个真实的问题。如果做完之后你停不下来，那就是信号。',
  },
}

export function calculatePercentile(score: number): number {
  if (score >= 85) return 95
  if (score >= 75) return 85
  if (score >= 65) return 70
  if (score >= 55) return 50
  if (score >= 45) return 30
  return 15
}

export function generateResult(
  stats: PlayerStats,
  _history: readonly ChoiceRecord[]
): GameResult {
  const founderType = determineFounderType(stats)
  const score = calculateScore(stats)
  const percentile = calculatePercentile(score)
  const profile = RESULT_PROFILES[founderType]

  return {
    founderType,
    stats,
    score,
    percentile,
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
