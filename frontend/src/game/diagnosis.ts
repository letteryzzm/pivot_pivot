// ── Diagnostic Engine for Builder/Founder Assessment ──
// Maps 15 diagnostic questions to specific information sources (IDs 1-35)
// Produces: stage diagnosis, blocker identification, decision patterns, and ranked resource recommendations

// ── Types ──

export type BuilderStage = 'idea' | 'build' | 'validate' | 'grow' | 'survive'

export type BlockerType =
  | 'direction'
  | 'action'
  | 'user'
  | 'monetize'
  | 'growth'
  | 'team'

export type DecisionPattern =
  | 'perfectionist'
  | 'over-analyst'
  | 'fast-pivot'
  | 'user-driven'
  | 'copycat'
  | 'organic'
  | 'researcher'
  | 'exploring'
  | 'deliberate'
  | 'intuitive'
  | 'consensus-seeker'
  | 'procrastinator'

export type FocusArea =
  | 'product'
  | 'growth'
  | 'fundraise'
  | 'learning'
  | 'planning'

export interface DiagnosisQuestion {
  readonly id: number
  readonly category:
    | 'routing'
    | 'validation'
    | 'execution'
    | 'growth'
    | 'resilience'
    | 'sustainability'
  readonly title: string
  readonly description: string
  readonly options: readonly DiagnosisOption[]
}

export interface DiagnosisOption {
  readonly id: string
  readonly text: string
  readonly sourceIds: readonly number[]
  readonly tags: Record<string, string>
  readonly feedback: string
}

export interface DiagnosisResult {
  readonly stage: BuilderStage
  readonly blocker: BlockerType
  readonly patterns: readonly string[]
  readonly focus: FocusArea
  readonly topSources: readonly number[]
  readonly allSources: readonly number[]
  readonly blindSpots: readonly BlindSpot[]
  readonly mentalState: string
}

export interface BlindSpot {
  readonly title: string
  readonly description: string
  readonly fromQuestion: number
  readonly sourceIds: readonly number[]
  readonly insight: string
}

// ── Questions ──
// Based on Roderick (董科含)'s framework from "How to Start in the Age of AI"

export const QUESTIONS: readonly DiagnosisQuestion[] = [
  // ── Routing Questions (Q1-Q2) ──
  {
    id: 1,
    category: 'routing',
    title: '你现在在哪个阶段？',
    description: '选择最接近你当前状态的描述。',
    options: [
      {
        id: 'A',
        text: '有想法，还没开始做',
        sourceIds: [],
        tags: { stage: 'idea' },
        feedback: '想法阶段——最关键的是验证需求，而不是打磨想法。',
      },
      {
        id: 'B',
        text: '在做了，但还没有用户',
        sourceIds: [],
        tags: { stage: 'build' },
        feedback: '构建阶段——确保你在解决真实的问题，而不是假设的问题。',
      },
      {
        id: 'C',
        text: '有用户了，但不确定算不算PMF',
        sourceIds: [],
        tags: { stage: 'validate' },
        feedback: '验证阶段——PMF不是感觉，是可以量化的。',
      },
      {
        id: 'D',
        text: '有收入了，在想怎么增长',
        sourceIds: [],
        tags: { stage: 'grow' },
        feedback: '增长阶段——增长的前提是你已经找到了可重复的获客方式。',
      },
      {
        id: 'E',
        text: '遇到了瓶颈或危机',
        sourceIds: [],
        tags: { stage: 'survive' },
        feedback: '瓶颈期——最重要的是找到根本原因，而不是盲目尝试。',
      },
    ],
  },
  {
    id: 2,
    category: 'routing',
    title: '你最大的卡点是什么？',
    description: '选择让你最头疼的那个问题。',
    options: [
      {
        id: 'A',
        text: '不知道做什么方向',
        sourceIds: [],
        tags: { blocker: 'direction' },
        feedback:
          '方向迷茫是正常的——但不能用"继续想"来解决，要用"去试"来解决。',
      },
      {
        id: 'B',
        text: '知道做什么但一直没动手',
        sourceIds: [],
        tags: { blocker: 'action' },
        feedback: '拖延的本质通常是恐惧，而不是懒惰。',
      },
      {
        id: 'C',
        text: '在做但不知道用户要什么',
        sourceIds: [],
        tags: { blocker: 'user' },
        feedback: '不知道用户要什么，意味着你还没有真正和用户对话过。',
      },
      {
        id: 'D',
        text: '有用户但不知道怎么收钱',
        sourceIds: [],
        tags: { blocker: 'monetize' },
        feedback: '变现难题往往不是定价问题，而是价值传递问题。',
      },
      {
        id: 'E',
        text: '有收入但增长不动',
        sourceIds: [],
        tags: { blocker: 'growth' },
        feedback: '增长停滞通常意味着你还没找到可规模化的获客渠道。',
      },
      {
        id: 'F',
        text: '团队/合伙人/心态问题',
        sourceIds: [],
        tags: { blocker: 'team' },
        feedback: '人的问题是最难也是最关键的问题——比产品问题更紧急。',
      },
    ],
  },
  // ── Validation (Q3-Q6) ──
  {
    id: 3,
    category: 'validation',
    title: '你为什么想创业？',
    description: '真正能走下去的，是你遇到一个问题已经无法忍受。',
    options: [
      {
        id: 'A',
        text: '不想打工 / 想赚钱',
        sourceIds: [35],
        tags: { motivation: 'escape' },
        feedback:
          '这可以让你开始，但很难让你坚持。真正走下去的人是因为忍受不了一个问题。',
      },
      {
        id: 'B',
        text: '看到一个问题反复出现，已经无法忍受',
        sourceIds: [1],
        tags: { motivation: 'problem' },
        feedback:
          '这是最好的创业理由——改变世界，从一个你无法忽视的问题开始。',
      },
      {
        id: 'C',
        text: '觉得这个时代有机会，想抓住',
        sourceIds: [4, 5],
        tags: { motivation: 'opportunity' },
        feedback:
          '看到机会是好事，但机会必须落地到一个具体的、有人愿意付代价的问题上。',
      },
      {
        id: 'D',
        text: '身边的人在创业，我也想试试',
        sourceIds: [35, 30],
        tags: { motivation: 'social' },
        feedback:
          '从众开始的创业，走到困难时最容易放弃。先找到属于你自己的那个问题。',
      },
    ],
  },
  {
    id: 4,
    category: 'validation',
    title: '你的认知来源是什么？',
    description: '认知 = 输入 × 判断 × 验证',
    options: [
      {
        id: 'A',
        text: '主要看文章、视频、课程',
        sourceIds: [7],
        tags: { cognition: 'passive' },
        feedback:
          '二手信息是起点，但不是终点。去和真正做事的人聊一次，胜过看十篇总结。',
      },
      {
        id: 'B',
        text: '经常和正在创业的人交流，接近一手信息',
        sourceIds: [35],
        tags: { cognition: 'active' },
        feedback:
          '高质量输入是认知的起点。保持这个习惯，同时开始做自己的判断。',
      },
      {
        id: 'C',
        text: '自己在做项目、做产品，从实践中学习',
        sourceIds: [2, 6],
        tags: { cognition: 'practitioner' },
        feedback:
          '做产品、做项目、赚到第一笔钱——这才是最有价值的认知来源。',
      },
      {
        id: 'D',
        text: '还没有特别系统的学习路径',
        sourceIds: [7, 6],
        tags: { cognition: 'none' },
        feedback:
          '学习路径应该是倒推的：问题→工具→技能。不是先学再做，而是边做边学。',
      },
    ],
  },
  {
    id: 5,
    category: 'validation',
    title: '你现在的想法，满足好问题的几个条件？',
    description:
      '好问题的5个条件：痛感强、频率高、有人愿意为结果付代价、你能更早接近用户、这个切口未来能长大。',
    options: [
      {
        id: 'A',
        text: '我觉得这是个好想法，但还没验证过',
        sourceIds: [1, 27],
        tags: { problem: 'unvalidated' },
        feedback:
          '想法本身没有价值，被验证过的才有。学生最大的问题：问题不够痛、切口和大市场没有关系。',
      },
      {
        id: 'B',
        text: '有人说痛，但我不确定他们会付钱',
        sourceIds: [1],
        tags: { problem: 'verbal' },
        feedback:
          '「说痛」和「愿意付代价」是两件事。去问他们现在为这个问题花了多少时间和钱。',
      },
      {
        id: 'C',
        text: '已经有人在为类似的解决方案付钱，我能做得更好',
        sourceIds: [1],
        tags: { problem: 'validated' },
        feedback:
          '已有人付钱说明需求真实。关键问题：你能用AI把它提速10倍或降本90%吗？',
      },
      {
        id: 'D',
        text: '我还没有具体想法',
        sourceIds: [1, 4, 5],
        tags: { problem: 'none' },
        feedback:
          '从你反复看见的低效开始。在你身边的混乱、低效、靠人力兜底的地方，就藏着机会。',
      },
    ],
  },
  {
    id: 6,
    category: 'validation',
    title: '你做过用户访谈吗？',
    description:
      '至少约20个目标用户（别找亲戚朋友），少问"你会不会用"，多关注行为——用户会撒谎，行为不会。',
    options: [
      {
        id: 'A',
        text: '没有，我觉得先把产品做好再说',
        sourceIds: [2, 1],
        tags: { user_research: 'none' },
        feedback:
          '很多年轻创业者死在这里——还没用户就开始做产品。聪明的做法是先卖出去再做产品。',
      },
      {
        id: 'B',
        text: '问了几个朋友/亲戚的意见',
        sourceIds: [1],
        tags: { user_research: 'friends' },
        feedback:
          '朋友的意见基本没用——他们不会对你说真话。去找20个不认识的目标用户。',
      },
      {
        id: 'C',
        text: '找了5-10个目标用户深度聊过',
        sourceIds: [1],
        tags: { user_research: 'some' },
        feedback:
          '好的开始。访谈的目标是确认：谁最痛、什么时候最痛、现在用什么笨办法撑着。',
      },
      {
        id: 'D',
        text: '已经和20+目标用户对话，有清晰的痛点记录',
        sourceIds: [1, 2],
        tags: { user_research: 'deep' },
        feedback:
          '你走在正确的路上。下一步：写一页纸——问题、谁痛、现在怎么解决、你准备先做什么。',
      },
    ],
  },
  // ── Execution (Q7-Q9) ──
  {
    id: 7,
    category: 'execution',
    title: '你的产品/MVP状态是什么？',
    description:
      'MVP的目标只有一个——证明这件事值得继续做。别墨迹尽快动手做，先手工交付也没关系。',
    options: [
      {
        id: 'A',
        text: '还在想，还没开始做',
        sourceIds: [2, 6],
        tags: { mvp: 'thinking' },
        feedback:
          '风险不会因为等待而降低，只会因为错过而放大。从一个小问题出发，先验证，再成长。',
      },
      {
        id: 'B',
        text: '在做了，但追求做得完美再上线',
        sourceIds: [2, 6],
        tags: { mvp: 'perfectionist' },
        feedback:
          '很多年轻创业者死在第一款产品想太大、做太大。先做最简单、刚好能用的版本。',
      },
      {
        id: 'C',
        text: '已经有一个能用的版本，在给用户用',
        sourceIds: [1, 3],
        tags: { mvp: 'live' },
        feedback:
          '好。现在盯三个数：使用、留存、付费意愿。边做边改，找到真正的需求。',
      },
      {
        id: 'D',
        text: '还没做产品，但已经在手工帮用户解决问题',
        sourceIds: [2],
        tags: { mvp: 'manual' },
        feedback:
          '这是最聪明的做法——先用最土的方法做，比如人工交付，再产品化。',
      },
    ],
  },
  {
    id: 8,
    category: 'execution',
    title: '你现在盯的核心数据是什么？',
    description: '盯三个数——使用、留存、付费意愿。',
    options: [
      {
        id: 'A',
        text: '注册用户数 / 下载量',
        sourceIds: [3, 6],
        tags: { metrics: 'vanity' },
        feedback:
          '注册量是虚荣指标。关键问题是：用户回来了吗？愿意付钱吗？',
      },
      {
        id: 'B',
        text: '留存率和活跃用户数',
        sourceIds: [1, 3],
        tags: { metrics: 'retention' },
        feedback:
          '正确的方向。留存是PMF最直接的信号——用户自己回来，就是最好的证明。',
      },
      {
        id: 'C',
        text: '收入 / 付费意愿',
        sourceIds: [26, 3],
        tags: { metrics: 'revenue' },
        feedback:
          '最诚实的指标。有人愿意掏钱，说明你在解决一个真实的问题。',
      },
      {
        id: 'D',
        text: '还没有数据可看',
        sourceIds: [2, 1],
        tags: { metrics: 'none' },
        feedback:
          '没有数据意味着你还没有用户。第一步不是做产品，是找到5个真实用户。',
      },
    ],
  },
  {
    id: 9,
    category: 'execution',
    title: '关于做事的顺序，你是怎么安排的？',
    description:
      '很多人把顺序搞反了——还没用户就做产品、什么都没做就讲品牌注册公司。',
    options: [
      {
        id: 'A',
        text: '先想清楚再行动，不打无准备的仗',
        sourceIds: [31, 6],
        tags: { sequence: 'prepare' },
        feedback:
          '你越等越会陷入准备的幻觉。好创业者在两三成把握时就起飞，边飞边造引擎。',
      },
      {
        id: 'B',
        text: '先做产品，产品好了用户自然来',
        sourceIds: [2, 1],
        tags: { sequence: 'product-first' },
        feedback:
          '做出来不重要，被用起来才重要。先问：如果你今天做完了，你会发给谁？',
      },
      {
        id: 'C',
        text: '先找到愿意付钱的人，再做产品',
        sourceIds: [2],
        tags: { sequence: 'sell-first' },
        feedback:
          '这是最高效的顺序。先卖出去再做产品，你永远不会浪费时间做没人要的东西。',
      },
      {
        id: 'D',
        text: '先注册公司、搞品牌、写商业计划书',
        sourceIds: [6, 2],
        tags: { sequence: 'bureaucracy' },
        feedback:
          '什么都没做就开始讲品牌、注册公司、追求完美开局——学生最常见的拖延，往往藏在顺序错位里。',
      },
    ],
  },
  // ── Growth (Q10-Q11) ──
  {
    id: 10,
    category: 'growth',
    title: '如果明天你的产品消失了，有多少用户会"非常失望"？',
    description: '这是Superhuman验证PMF的经典问题。',
    options: [
      {
        id: 'A',
        text: '不知道，没问过',
        sourceIds: [1],
        tags: {},
        feedback:
          '这是最需要立刻修正的盲区。Superhuman的PMF方法论的第一步就是问这个问题——你不能优化一个你没有量化的东西。',
      },
      {
        id: 'B',
        text: '可能不到10%',
        sourceIds: [1, 3],
        tags: {},
        feedback:
          '低于40%意味着还没有PMF。但不要灰心——关键是找到那些"非常失望"的少数用户，理解他们为什么离不开你。',
      },
      {
        id: 'C',
        text: '大概20-30%',
        sourceIds: [1, 3],
        tags: {},
        feedback:
          '接近但还没到PMF的临界点（40%）。你已经抓住了一部分用户的核心需求，现在需要把这个群体扩大。',
      },
      {
        id: 'D',
        text: '应该超过40%',
        sourceIds: [1, 3],
        tags: {},
        feedback:
          '恭喜，这是PMF的信号。下一步是把增长引擎打开——但记住，PMF不是一次性的，它需要持续维护。',
      },
      {
        id: 'E',
        text: '我还没有用户',
        sourceIds: [2, 1],
        tags: {},
        feedback:
          '没有用户不是问题，问题是你有没有在积极寻找第一批用户。不要等产品"准备好"——用最简单的方式先服务10个人。',
      },
    ],
  },
  {
    id: 11,
    category: 'growth',
    title: '关于融资，你怎么想？',
    description:
      '有明确目标才融资，不缺钱时融资。方向都没跑通时，过早拿钱很容易把组织带偏。',
    options: [
      {
        id: 'A',
        text: '我需要先融资才能开始',
        sourceIds: [11, 19],
        tags: { fundraise: 'prerequisite' },
        feedback:
          '方向都没跑通时，过早拿钱很容易把组织带偏。先证明这件事在动起来了。',
      },
      {
        id: 'B',
        text: '先bootstrapping跑通模型，有需要再融',
        sourceIds: [30, 21],
        tags: { fundraise: 'bootstrap' },
        feedback:
          '正确的顺序。钱是用来加速的，不是用来找方向的。',
      },
      {
        id: 'C',
        text: '已经有用户和收入，在考虑用钱加速',
        sourceIds: [17],
        tags: { fundraise: 'ready' },
        feedback:
          '最好的融资时机：你已经证明这件事在动起来了，钱能让你更快。',
      },
      {
        id: 'D',
        text: '还没想过这个问题',
        sourceIds: [2, 6],
        tags: { fundraise: 'not-thinking' },
        feedback:
          '前期不用想融资。先把时间花在验证需求和找到前5个用户上。',
      },
    ],
  },
  // ── Resilience (Q12-Q13) ──
  {
    id: 12,
    category: 'resilience',
    title: '你上一次失败后做了什么？',
    description:
      '好创始人学习快——犯错后变强、懂得复利——每次失败都叠加不归零。',
    options: [
      {
        id: 'A',
        text: '总结了教训，调整方向继续做',
        sourceIds: [30],
        tags: { resilience: 'iterate' },
        feedback:
          '每次失败都不是归零，而是叠加——这是创业的复利。',
      },
      {
        id: 'B',
        text: '换了一个完全不同的方向',
        sourceIds: [28, 29],
        tags: { resilience: 'pivot' },
        feedback:
          '快速止损是能力，但注意：连续换方向不叫试错，叫逃避。关键是从每次失败里提取判断。',
      },
      {
        id: 'C',
        text: '停了一段时间，不确定要不要继续',
        sourceIds: [30, 34],
        tags: { resilience: 'paused' },
        feedback:
          '创业公司死因只有一个：创始人放弃。停下来反思很好，但不要停太久。',
      },
      {
        id: 'D',
        text: '还没有经历过真正的失败',
        sourceIds: [2, 30],
        tags: { resilience: 'no-failure' },
        feedback:
          '没有失败过说明你还没真正开始。真正的开始，从一个小问题出发，先验证，再成长。',
      },
    ],
  },
  {
    id: 13,
    category: 'resilience',
    title: '你的决策习惯是什么？',
    description:
      '好创始人——有自己的判断，独立思考，从第一性原理做出判断。',
    options: [
      {
        id: 'A',
        text: '收集足够信息后慎重决定',
        sourceIds: [31, 6],
        tags: { decision: 'deliberate' },
        feedback:
          '在信息不完整的时候依然推进，不等完美条件——这是创业最稀缺的能力之一。70%信息就该决策。',
      },
      {
        id: 'B',
        text: '快速决定，错了再改',
        sourceIds: [31, 32],
        tags: { decision: 'fast' },
        feedback:
          '行动快，更早接近真相。但记得记录判断——每周写一次\'我为什么这样想\'，建立自己的判断标准。',
      },
      {
        id: 'C',
        text: '倾向于问别人的意见',
        sourceIds: [32, 33],
        tags: { decision: 'consensus' },
        feedback:
          '去和真正做事的人聊一次胜过看十篇总结。但最终要建立自己的判断——你现在大多数判断是来自自己，还是来自别人？',
      },
      {
        id: 'D',
        text: '经常拖延，很难做决定',
        sourceIds: [31, 30],
        tags: { decision: 'procrastinator' },
        feedback:
          '拖延的本质通常不是懒惰，而是恐惧。但风险不会因为等待而降低，只会因为错过而放大。',
      },
    ],
  },
  // ── Sustainability (Q14-Q15) ──
  {
    id: 14,
    category: 'sustainability',
    title: '你有结构外生长力吗？',
    description:
      '在没有任务、没有外部压力的情况下，能自我设定目标、持续推进、独立成长。',
    options: [
      {
        id: 'A',
        text: '我需要外部压力才能行动（deadline、老板、考试）',
        sourceIds: [30, 34],
        tags: { agency: 'external' },
        feedback:
          '大多数人都是这样。但创业没有人给你布置任务——你必须学会在没有任务的时候也能推进。',
      },
      {
        id: 'B',
        text: '我会自己设定目标，但经常半途而废',
        sourceIds: [30, 33],
        tags: { agency: 'inconsistent' },
        feedback:
          '好奇心密度高但执行力不够——每次失败后问自己：我在这次里学到了什么？',
      },
      {
        id: 'C',
        text: '没人管我的时候我反而做得最好',
        sourceIds: [6, 2],
        tags: { agency: 'self-driven' },
        feedback:
          '这是结构外生长力的信号。学东西是为了解决问题，不是刷履历——保持这个状态。',
      },
      {
        id: 'D',
        text: '我会主动做别人没让我做的事，而且停不下来',
        sourceIds: [6, 30],
        tags: { agency: 'high' },
        feedback:
          '你身上有创业者最稀缺的特质——没有任务也能推进。这种\'火\'是所有投资人最想在年轻人身上看到的。',
      },
    ],
  },
  {
    id: 15,
    category: 'sustainability',
    title: '关于创业的心理准备',
    description:
      '愿意承受孤独、失败、无人理解甚至误解。被拒100次还继续坚持。',
    options: [
      {
        id: 'A',
        text: '我精力充沛，觉得自己能搞定',
        sourceIds: [34, 33],
        tags: { mindset: 'confident' },
        feedback:
          '这个时代最稀缺的不只是能力，还有韧性——有品味也有韧性，知道什么是好，也扛得住长期困难。',
      },
      {
        id: 'B',
        text: '有时焦虑，但能扛住',
        sourceIds: [30],
        tags: { mindset: 'anxious' },
        feedback:
          '正常。创业是试错循环的过程，不要怕失败。你是公司最重要的变量，你的认知决定公司的上限。',
      },
      {
        id: 'C',
        text: '经常感到孤独，找不到理解自己的人',
        sourceIds: [34, 35],
        tags: { mindset: 'lonely' },
        feedback:
          '愿意承受孤独、失败、无人理解甚至误解——这本身就是一种证明。去找和你一样在路上的人。',
      },
      {
        id: 'D',
        text: '不确定自己是不是适合创业',
        sourceIds: [35, 30],
        tags: { mindset: 'uncertain' },
        feedback:
          '创业不适合所有人，但\'开始\'适合。从一个小实验开始，两周后看自己停不停得下来——停不下来就是信号。',
      },
    ],
  },
]

// ── Blind Spot Detection ──

interface BlindSpotRule {
  readonly condition: (ctx: DiagnosisContext) => boolean
  readonly title: string
  readonly description: string
  readonly sourceIds: readonly number[]
  readonly insight: string
  readonly fromQuestion: number
}

interface DiagnosisContext {
  readonly stage: BuilderStage
  readonly blocker: BlockerType
  readonly focus: FocusArea
  readonly patterns: readonly string[]
  readonly answerMap: ReadonlyMap<number, string>
}

const BLIND_SPOT_RULES: readonly BlindSpotRule[] = [
  {
    condition: (ctx) => ctx.stage === 'idea' && ctx.focus === 'product',
    title: '你还没验证需求就在做产品',
    description:
      '在想法阶段，最重要的不是打磨产品，而是验证你解决的问题是否真实存在、是否足够痛。',
    sourceIds: [1, 2],
    insight:
      'YC的核心理念：Make something people want。先确认people want，再make something。',
    fromQuestion: 6,
  },
  {
    condition: (ctx) => ctx.stage === 'build' && ctx.focus === 'learning',
    title: '你在用学习回避行动',
    description:
      '在构建阶段还在大量学习和研究，可能是在用"准备"来推迟面对不确定性。',
    sourceIds: [31, 30],
    insight:
      '知识的边际收益递减得很快。你已经知道的够多了，缺的是行动中的反馈。',
    fromQuestion: 6,
  },
  {
    condition: (ctx) => ctx.stage === 'validate' && ctx.focus === 'fundraise',
    title: '没有PMF就去融资是最常见的错误',
    description:
      '在还没验证PMF的时候把精力花在融资上，是早期创业者最常犯的优先级错误。',
    sourceIds: [1, 19],
    insight:
      '投资人最想看到的不是你的pitch，而是你的PMF数据。先有数据，融资自然会容易10倍。',
    fromQuestion: 6,
  },
  {
    condition: (ctx) => ctx.stage === 'grow' && ctx.focus === 'product',
    title: '增长阶段最大的杠杆是定价不是产品',
    description:
      '在增长阶段，继续打磨产品的边际收益远低于优化定价和获客渠道。',
    sourceIds: [26, 3],
    insight: '研究显示，定价优化的效果是获客优化的4倍。增长的杠杆在产品之外。',
    fromQuestion: 6,
  },
  {
    condition: (ctx) =>
      ctx.blocker === 'action' && ctx.patterns.includes('over-analyst'),
    title: '你的分析能力远超行动力',
    description:
      '你善于分析问题，但分析本身不产生结果。你需要的不是更好的分析框架，而是一个"足够好就开始"的决策标准。',
    sourceIds: [31, 6],
    insight:
      'Bezos的70%信息法则：当你有70%的信息就该行动了。等到90%时你已经太慢了。',
    fromQuestion: 4,
  },
  {
    condition: (ctx) => ctx.blocker === 'user' && ctx.focus === 'product',
    title: '你在猜用户要什么而不是去问',
    description:
      '你说最大的卡点是不知道用户要什么，但你的时间却花在做产品上。这是典型的"用构建来回避验证"。',
    sourceIds: [1, 2],
    insight:
      '停下来，走出去，和20个目标用户对话。不是推销你的产品，是理解他们的问题。',
    fromQuestion: 6,
  },
  {
    condition: (ctx) => ctx.patterns.includes('perfectionist'),
    title: '完美主义是行动的最大敌人',
    description:
      '你在面对"推倒重来"的选择时，倾向于追求更好的版本。但在创业早期，完成比完美重要1000倍。',
    sourceIds: [2, 6],
    insight:
      'Reid Hoffman说过：如果你的第一版产品不让你感到尴尬，你发布得太晚了。',
    fromQuestion: 4,
  },
  {
    condition: (ctx) => ctx.patterns.includes('consensus-seeker'),
    title: '过度咨询他人会外包你的思考',
    description:
      '征询意见是好习惯，但如果你每次决策都要问很多人，你可能在用别人的确定性来回避自己的不确定性。',
    sourceIds: [32],
    insight:
      '先独立思考到一个结论，再用别人的意见来验证和修正，而不是用别人的意见来替代你的判断。',
    fromQuestion: 12,
  },
  {
    condition: (ctx) => ctx.answerMap.get(10) === 'A',
    title: '你从未量化过PMF',
    description:
      '你从来没有问过用户"如果这个产品消失了你会怎样"。这意味着你在凭感觉判断产品价值，而不是用数据。',
    sourceIds: [1],
    insight:
      'Superhuman的PMF方法论的第一步就是量化——把"感觉还不错"变成一个可追踪的数字。',
    fromQuestion: 10,
  },
  {
    condition: (ctx) => ctx.answerMap.get(15) === 'C',
    title: '你的身份和项目融为一体是最危险的信号',
    description:
      '当项目成为你唯一的身份来源时，每一次挫折都会变成对你个人的否定。这不可持续。',
    sourceIds: [34, 30],
    insight:
      '项目可以失败，但你不会失败。建立创业之外的身份锚点是心理韧性的基础。',
    fromQuestion: 15,
  },
]

function detectBlindSpots(ctx: DiagnosisContext): readonly BlindSpot[] {
  return BLIND_SPOT_RULES.filter((rule) => rule.condition(ctx)).map(
    (rule) => ({
      title: rule.title,
      description: rule.description,
      fromQuestion: rule.fromQuestion,
      sourceIds: rule.sourceIds,
      insight: rule.insight,
    })
  )
}

// ── Source Ranking ──

function rankSources(
  answers: readonly { questionId: number; optionId: string }[],
  stage: BuilderStage,
  blindSpots: readonly BlindSpot[]
): { topSources: readonly number[]; allSources: readonly number[] } {
  const questionMap = new Map(QUESTIONS.map((q) => [q.id, q]))
  const sourceFrequency = new Map<number, number>()

  // Count frequency from question answers
  for (const answer of answers) {
    const question = questionMap.get(answer.questionId)
    if (!question) continue

    const option = question.options.find((o) => o.id === answer.optionId)
    if (!option) continue

    for (const sourceId of option.sourceIds) {
      sourceFrequency.set(sourceId, (sourceFrequency.get(sourceId) ?? 0) + 1)
    }
  }

  // Add sources from blind spots with a bonus weight
  for (const blindSpot of blindSpots) {
    for (const sourceId of blindSpot.sourceIds) {
      sourceFrequency.set(
        sourceId,
        (sourceFrequency.get(sourceId) ?? 0) + 2
      )
    }
  }

  // Stage-specific source boosting
  const stageBoosts: Record<BuilderStage, readonly number[]> = {
    idea: [1, 4, 5, 35],
    build: [2, 1, 6],
    validate: [1, 9, 10, 3],
    grow: [3, 9, 26, 18],
    survive: [30, 28, 29, 34],
  }

  for (const sourceId of stageBoosts[stage]) {
    sourceFrequency.set(sourceId, (sourceFrequency.get(sourceId) ?? 0) + 1)
  }

  // Sort by frequency descending
  const sorted = [...sourceFrequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id)

  return {
    topSources: sorted.slice(0, 5),
    allSources: sorted,
  }
}

// ── Mental State Detection ──

function detectMentalState(
  answerMap: ReadonlyMap<number, string>
): string {
  const q15Answer = answerMap.get(15)

  const mentalStateMap: Record<string, string> = {
    A: '精力充沛但需警惕burnout——恢复平均需要9个月',
    B: '心理状态尚可，建议建立定期的心理检查机制',
    C: '身份与项目过度绑定，需要建立创业之外的身份锚点',
    D: '孤独感明显，建议尽快加入创业者社区获得同伴支持',
  }

  return q15Answer
    ? mentalStateMap[q15Answer] ?? '未检测到明显心理健康风险'
    : '未检测到明显心理健康风险'
}

// ── Core Diagnosis Function ──

export function diagnose(
  answers: readonly { questionId: number; optionId: string }[]
): DiagnosisResult {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.optionId]))
  const questionMap = new Map(QUESTIONS.map((q) => [q.id, q]))

  // 1. Extract stage from Q1
  const q1Answer = answerMap.get(1) ?? 'A'
  const q1Question = questionMap.get(1)
  const q1Option = q1Question?.options.find((o) => o.id === q1Answer)
  const stage = (q1Option?.tags.stage as BuilderStage | undefined) ?? 'idea'

  // 2. Extract blocker from Q2
  const q2Answer = answerMap.get(2) ?? 'A'
  const q2Question = questionMap.get(2)
  const q2Option = q2Question?.options.find((o) => o.id === q2Answer)
  const blocker =
    (q2Option?.tags.blocker as BlockerType | undefined) ?? 'direction'

  // 3. Collect all patterns from Q3-Q15
  const patterns: string[] = []
  for (const answer of answers) {
    const question = questionMap.get(answer.questionId)
    if (!question) continue

    const option = question.options.find((o) => o.id === answer.optionId)
    if (!option) continue

    const pattern = option.tags.pattern
    if (pattern) {
      patterns.push(pattern)
    }
  }

  // 4. Derive focus from multiple signals
  const q7Answer = answerMap.get(7) ?? 'A'
  const q8Answer = answerMap.get(8) ?? 'D'
  const q9Answer = answerMap.get(9) ?? 'A'

  let focus: FocusArea = 'product'
  // If no MVP and no data → still planning
  if (q7Answer === 'A' && q8Answer === 'D') focus = 'planning'
  // If sequence is sell-first or manual delivery → growth-focused
  else if (q9Answer === 'C' || q7Answer === 'D') focus = 'growth'
  // If tracking revenue → growth
  else if (q8Answer === 'C') focus = 'growth'
  // If perfectionist on MVP → product-focused
  else if (q7Answer === 'B') focus = 'product'
  // If fundraise is prerequisite (Q11)
  else if (answerMap.get(11) === 'A') focus = 'fundraise'
  // If lots of learning but no action (Q4=A + Q7=A)
  else if (answerMap.get(4) === 'A' && q7Answer === 'A') focus = 'learning'

  // 5. Detect blind spots
  const ctx: DiagnosisContext = {
    stage,
    blocker,
    focus,
    patterns,
    answerMap,
  }
  const blindSpots = detectBlindSpots(ctx)

  // 6. Rank sources
  const { topSources, allSources } = rankSources(answers, stage, blindSpots)

  // 7. Detect mental state
  const mentalState = detectMentalState(answerMap)

  // 8. Deduplicate patterns
  const uniquePatterns = [...new Set(patterns)]

  return {
    stage,
    blocker,
    patterns: uniquePatterns,
    focus,
    topSources,
    allSources,
    blindSpots,
    mentalState,
  }
}
