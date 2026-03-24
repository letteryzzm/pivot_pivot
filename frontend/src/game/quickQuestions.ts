// ── Roderick's Founder Assessment Quick Questions ──
// Based on the real "创业准备度自测" by 董科含 (Roderick)
// These questions rotate between narrative scenario rounds

export interface QuickQuestion {
  readonly id: number
  readonly category: 'commitment' | 'motivation' | 'resilience' | 'independence' | 'execution' | 'risk' | 'team' | 'longterm' | 'mindset'
  readonly text: string
  readonly options: readonly QuickOption[]
}

export interface QuickOption {
  readonly id: string
  readonly text: string
  readonly score: number // 1-4, higher = more founder-ready
  readonly sourceIds: readonly number[]
  readonly tag: string // diagnostic signal
}

export interface QuickAnswer {
  readonly questionId: number
  readonly optionId: string
  readonly score: number
}

export const QUICK_QUESTIONS: readonly QuickQuestion[] = [
  // ── Commitment ──
  {
    id: 1,
    category: 'commitment',
    text: '如果你收到一份年薪百万的大厂Offer，同时你的项目在验证期有了一点眉目。你只能给自己开5000月薪，未来完全不确定。你会怎么选？',
    options: [
      { id: 'A', text: '选工作，需要家庭稳定', score: 1, sourceIds: [35], tag: 'stability-first' },
      { id: 'B', text: '想先工作几年再说', score: 2, sourceIds: [35, 30], tag: 'deferred' },
      { id: 'C', text: '边工作边做副业项目', score: 3, sourceIds: [6], tag: 'hedged' },
      { id: 'D', text: '选创业，但会努力沟通', score: 4, sourceIds: [6, 2], tag: 'all-in' },
    ],
  },
  {
    id: 2,
    category: 'commitment',
    text: '如果有人给你1000美元加一张机票，让你去硅谷加入一个YC孵化的快速增长初创公司担任核心职位，半年内获得学习和人脉，但没有额外工资。你会？',
    options: [
      { id: 'A', text: '拒绝，风险和收益不匹配', score: 1, sourceIds: [35], tag: 'risk-averse' },
      { id: 'B', text: '纠结，需要牺牲当前稳定', score: 2, sourceIds: [30], tag: 'hesitant' },
      { id: 'C', text: '接受，专注于学习和成长', score: 3, sourceIds: [7, 6], tag: 'learning-driven' },
      { id: 'D', text: '接受，同时积极寻找创业机会', score: 4, sourceIds: [6, 2], tag: 'opportunity-seeker' },
    ],
  },
  {
    id: 3,
    category: 'commitment',
    text: '你正在读大三，一个教授的项目有机会让你参与解决一个行业难题，有45%的可能获得早期投资。需要你休学。你会？',
    options: [
      { id: 'A', text: '优先完成学业，毕业后再考虑', score: 1, sourceIds: [35], tag: 'degree-first' },
      { id: 'B', text: '观望评估，尝试不放弃学业的前提下参与', score: 2, sourceIds: [6], tag: 'hedged' },
      { id: 'C', text: '权衡潜在收益后决定是否休学', score: 3, sourceIds: [31, 6], tag: 'calculated' },
      { id: 'D', text: '坚信这个机会远比文凭重要，毫不犹豫休学', score: 4, sourceIds: [6, 30], tag: 'conviction' },
    ],
  },
  // ── Motivation ──
  {
    id: 4,
    category: 'motivation',
    text: '你创业最主要的原因是？',
    options: [
      { id: 'A', text: '赚钱', score: 1, sourceIds: [35], tag: 'money' },
      { id: 'B', text: '想证明自己有能力', score: 2, sourceIds: [34], tag: 'ego' },
      { id: 'C', text: '想解决身边真实存在的问题', score: 3, sourceIds: [1], tag: 'problem-driven' },
      { id: 'D', text: '想在过程中成长并尝试改变一些东西', score: 4, sourceIds: [30], tag: 'growth-driven' },
    ],
  },
  {
    id: 5,
    category: 'motivation',
    text: '你现在最渴望的是什么？',
    options: [
      { id: 'A', text: '稳定和安全的生活', score: 1, sourceIds: [35], tag: 'stability' },
      { id: 'B', text: '别人的认可和赞美', score: 2, sourceIds: [34], tag: 'validation' },
      { id: 'C', text: '掌握自己未来的方向', score: 3, sourceIds: [30, 31], tag: 'autonomy' },
      { id: 'D', text: '推动一些真实改变', score: 4, sourceIds: [1, 6], tag: 'impact' },
    ],
  },
  {
    id: 6,
    category: 'motivation',
    text: '你对赚钱的看法？',
    options: [
      { id: 'A', text: '快速赚钱最重要', score: 1, sourceIds: [26], tag: 'short-term' },
      { id: 'B', text: '稳定赚钱就好', score: 2, sourceIds: [30], tag: 'stable' },
      { id: 'C', text: '赚钱+成长并重', score: 3, sourceIds: [3, 30], tag: 'balanced' },
      { id: 'D', text: '优先做有价值的事，赚钱是结果', score: 4, sourceIds: [30], tag: 'value-first' },
    ],
  },
  // ── Independence ──
  {
    id: 7,
    category: 'independence',
    text: '如果你向10个朋友讲想法，9个都说不靠谱，你会？',
    options: [
      { id: 'A', text: '当场放弃', score: 1, sourceIds: [32], tag: 'follower' },
      { id: 'B', text: '很犹豫，可能拖延', score: 2, sourceIds: [31, 30], tag: 'hesitant' },
      { id: 'C', text: '偷偷先做点小验证', score: 3, sourceIds: [2, 1], tag: 'quiet-doer' },
      { id: 'D', text: '不care，继续做', score: 4, sourceIds: [30, 31], tag: 'independent' },
    ],
  },
  {
    id: 8,
    category: 'independence',
    text: '当你发现自己的想法和市场主流趋势完全相反时，你会？',
    options: [
      { id: 'A', text: '立刻放弃，跟随大趋势', score: 1, sourceIds: [32], tag: 'follower' },
      { id: 'B', text: '动摇，尝试先观望', score: 2, sourceIds: [31], tag: 'hesitant' },
      { id: 'C', text: '自己去找数据和用户反馈验证，再决定是否坚持', score: 3, sourceIds: [1, 31], tag: 'evidence-driven' },
      { id: 'D', text: '越是逆势，越想坚持到底', score: 4, sourceIds: [30, 1], tag: 'contrarian' },
    ],
  },
  // ── Resilience ──
  {
    id: 9,
    category: 'resilience',
    text: '如果你第一次产品上线，用户不到50个，几乎没人用，你会？',
    options: [
      { id: 'A', text: '觉得失败，放弃方向', score: 1, sourceIds: [30], tag: 'quit' },
      { id: 'B', text: '先停下来休整', score: 2, sourceIds: [30], tag: 'pause' },
      { id: 'C', text: '分析数据，找人帮忙优化', score: 3, sourceIds: [1, 30], tag: 'diagnose' },
      { id: 'D', text: '反复迭代，直到跑出用户', score: 4, sourceIds: [2, 3], tag: 'persist' },
    ],
  },
  {
    id: 10,
    category: 'resilience',
    text: '你的项目上线6个月，用户增长停滞，资金即将耗尽，你还被投资人拒绝了60次。你的内心状态是？',
    options: [
      { id: 'A', text: '感到焦虑和挫败，开始怀疑自己的方向', score: 1, sourceIds: [34, 30], tag: 'anxious' },
      { id: 'B', text: '认为已经失败，开始寻找下一个机会', score: 2, sourceIds: [28, 29], tag: 'next-thing' },
      { id: 'C', text: '视之为反馈，主动和失败的投资人、用户沟通寻找突破口', score: 3, sourceIds: [30, 1], tag: 'feedback-seeker' },
      { id: 'D', text: '不卑不亢，保持专注和冷静，集中在解决问题上，并乐在其中', score: 4, sourceIds: [30], tag: 'unshakeable' },
    ],
  },
  {
    id: 11,
    category: 'resilience',
    text: '如果有人告诉你创业90%会失败，100个投资人告诉你不会投资你，你不适合创业，你会？',
    options: [
      { id: 'A', text: '不创业', score: 1, sourceIds: [35], tag: 'deterred' },
      { id: 'B', text: '犹豫很久', score: 2, sourceIds: [30], tag: 'hesitant' },
      { id: 'C', text: '先试试看', score: 3, sourceIds: [2, 6], tag: 'try-first' },
      { id: 'D', text: '即使失败、没人投资也要坚持', score: 4, sourceIds: [30], tag: 'unstoppable' },
    ],
  },
  {
    id: 12,
    category: 'resilience',
    text: '如果你最信任的合伙人背叛，带走核心资源，而你同时陷入抑郁状态，你会？',
    options: [
      { id: 'A', text: '放弃，重新开始别的事', score: 1, sourceIds: [30], tag: 'quit' },
      { id: 'B', text: '犹豫很久', score: 2, sourceIds: [34], tag: 'frozen' },
      { id: 'C', text: '咬牙重新组队继续做', score: 3, sourceIds: [30, 33], tag: 'rebuild' },
      { id: 'D', text: '立刻反击，另辟蹊径杀回去', score: 4, sourceIds: [30, 31], tag: 'fight-back' },
    ],
  },
  {
    id: 13,
    category: 'resilience',
    text: '如果竞争对手抄袭你并拿到融资，还用三倍工资挖走你的员工，你会？',
    options: [
      { id: 'A', text: '放弃，转做别的', score: 1, sourceIds: [30], tag: 'quit' },
      { id: 'B', text: '很受打击，停下调整', score: 2, sourceIds: [30], tag: 'shaken' },
      { id: 'C', text: '分析对方，寻找差异化', score: 3, sourceIds: [1, 31], tag: 'strategic' },
      { id: 'D', text: '不眠不休迭代，想办法赢回来', score: 4, sourceIds: [30, 3], tag: 'relentless' },
    ],
  },
  // ── Risk Tolerance ──
  {
    id: 14,
    category: 'risk',
    text: '如果项目需要你长时间牺牲舒适生活——搬到陌生城市、住在简陋环境里、睡公司，你会？',
    options: [
      { id: 'A', text: '完全不能，生活质量对我很重要', score: 1, sourceIds: [35], tag: 'comfort-first' },
      { id: 'B', text: '可以短期接受，但会寻找改善办法', score: 2, sourceIds: [6], tag: 'temporary' },
      { id: 'C', text: '可以坚持，只要项目在进展', score: 3, sourceIds: [30], tag: 'tolerate' },
      { id: 'D', text: '不觉得是问题，反而觉得这种状态更专注', score: 4, sourceIds: [30], tag: 'thrives' },
    ],
  },
  {
    id: 15,
    category: 'risk',
    text: '如果你连续6个月没有任何收入，每月还要支出5000-1万，只能靠借钱撑下去，你会？',
    options: [
      { id: 'A', text: '完全不可能接受', score: 1, sourceIds: [35], tag: 'no-way' },
      { id: 'B', text: '很痛苦但勉强坚持', score: 2, sourceIds: [30], tag: 'painful' },
      { id: 'C', text: '可以撑一段时间', score: 3, sourceIds: [30], tag: 'endure' },
      { id: 'D', text: '不觉得是问题，只要项目没死，自己饿不死', score: 4, sourceIds: [30], tag: 'unfazed' },
    ],
  },
  {
    id: 16,
    category: 'risk',
    text: '如果你是学生，手里只有5万块钱，可以拿旅游签去硅谷创业做你想做的方向（不能打工，风险极高），你会？',
    options: [
      { id: 'A', text: '完全不会去', score: 1, sourceIds: [35], tag: 'no-risk' },
      { id: 'B', text: '很想去，但现实压力太大', score: 2, sourceIds: [30], tag: 'tempted' },
      { id: 'C', text: '会去，但想办法降低风险', score: 3, sourceIds: [31, 6], tag: 'calculated-risk' },
      { id: 'D', text: '不顾一切去，到了再解决身份问题', score: 4, sourceIds: [30, 2], tag: 'all-in' },
    ],
  },
  {
    id: 17,
    category: 'risk',
    text: '公司账户只剩5000元，所有投资、亲友借款都试过了，只剩高利息网贷，你会？',
    options: [
      { id: 'A', text: '不会借，宁愿公司倒闭', score: 1, sourceIds: [30], tag: 'rational-quit' },
      { id: 'B', text: '很犹豫，可能停下', score: 2, sourceIds: [30], tag: 'hesitant' },
      { id: 'C', text: '借，但心里慌', score: 3, sourceIds: [30], tag: 'scared-but-do' },
      { id: 'D', text: '借，只要能撑下去，内心没有波澜', score: 4, sourceIds: [30], tag: 'cold-blooded' },
    ],
  },
  // ── Execution ──
  {
    id: 18,
    category: 'execution',
    text: '如果你只有5000块钱启动资金，你会？',
    options: [
      { id: 'A', text: '放弃', score: 1, sourceIds: [35], tag: 'quit' },
      { id: 'B', text: '等有更多钱再开始', score: 2, sourceIds: [30, 31], tag: 'wait' },
      { id: 'C', text: '先做个小实验', score: 3, sourceIds: [2, 1], tag: 'experiment' },
      { id: 'D', text: '马上动手，用最小成本跑起来', score: 4, sourceIds: [2, 6], tag: 'scrappy' },
    ],
  },
  {
    id: 19,
    category: 'execution',
    text: '如果你遇到完全不懂的领域（比如区块链、供应链、跨境清关），你会？',
    options: [
      { id: 'A', text: '暂时搁置，先做自己擅长的事', score: 1, sourceIds: [6], tag: 'avoid' },
      { id: 'B', text: '找一个懂行的专家合作', score: 2, sourceIds: [25, 15], tag: 'delegate' },
      { id: 'C', text: '快速学习相关知识，直到能理解核心并做出关键判断', score: 3, sourceIds: [7, 31], tag: 'learn-enough' },
      { id: 'D', text: '沉浸式深入学习，直至成为专家并能独立解决', score: 4, sourceIds: [7, 6], tag: 'deep-dive' },
    ],
  },
  {
    id: 20,
    category: 'execution',
    text: '如果你的产品上线，但没有钱买流量也没有人脉关系网，你会怎么做？',
    options: [
      { id: 'A', text: '等有资源再推广', score: 1, sourceIds: [2], tag: 'wait' },
      { id: 'B', text: '求助于投资人或熟人', score: 2, sourceIds: [11], tag: 'ask-help' },
      { id: 'C', text: '想办法找到低成本推广渠道，自己去做', score: 3, sourceIds: [9], tag: 'resourceful' },
      { id: 'D', text: '主动冷启动，用陌生拜访、社群、内容等方式跑起来', score: 4, sourceIds: [2, 9], tag: 'hustle' },
    ],
  },
  {
    id: 21,
    category: 'execution',
    text: '你做事的习惯更接近？',
    options: [
      { id: 'A', text: '三分钟热度', score: 1, sourceIds: [30], tag: 'fleeting' },
      { id: 'B', text: '常做到一半就停下', score: 2, sourceIds: [31, 30], tag: 'half-done' },
      { id: 'C', text: '计划+执行', score: 3, sourceIds: [6, 31], tag: 'planner' },
      { id: 'D', text: '设目标就死磕到底', score: 4, sourceIds: [30, 2], tag: 'relentless' },
    ],
  },
  {
    id: 22,
    category: 'execution',
    text: '如果竞争对手突然上线相似产品，你会？',
    options: [
      { id: 'A', text: '害怕，考虑退出', score: 1, sourceIds: [30], tag: 'scared' },
      { id: 'B', text: '尽量绕开', score: 2, sourceIds: [1], tag: 'avoid' },
      { id: 'C', text: '学习模仿', score: 3, sourceIds: [1], tag: 'copy' },
      { id: 'D', text: '主动对抗并找差异化', score: 4, sourceIds: [1, 31], tag: 'differentiate' },
    ],
  },
  // ── Team ──
  {
    id: 23,
    category: 'team',
    text: '当团队迅速扩张时，你会如何应对角色变化？',
    options: [
      { id: 'A', text: '继续埋头做执行，不太适应管理', score: 1, sourceIds: [25], tag: 'ic-only' },
      { id: 'B', text: '勉强适应，但更希望别人来管人', score: 2, sourceIds: [25, 33], tag: 'reluctant' },
      { id: 'C', text: '学习管理方法，逐渐带团队', score: 3, sourceIds: [25, 32], tag: 'learning' },
      { id: 'D', text: '主动转型，把更多精力放在战略和组织上', score: 4, sourceIds: [6, 32], tag: 'leader' },
    ],
  },
  {
    id: 24,
    category: 'team',
    text: '如果你招到一个比你强的技术合伙人，你会？',
    options: [
      { id: 'A', text: '避免冲突，尽量迁就他', score: 1, sourceIds: [15], tag: 'passive' },
      { id: 'B', text: '害怕被取代，留后手', score: 2, sourceIds: [15, 33], tag: 'insecure' },
      { id: 'C', text: '欣赏并学习，给更多股份', score: 3, sourceIds: [15, 25], tag: 'generous' },
      { id: 'D', text: '主动给更大空间和股份，如果他要创业就成就他', score: 4, sourceIds: [15, 30], tag: 'magnanimous' },
    ],
  },
  {
    id: 25,
    category: 'team',
    text: '你的一个核心团队成员最近表现不佳，影响了团队士气和项目进度。他能力很好但态度出了问题并开始抱怨。你会？',
    options: [
      { id: 'A', text: '勉强忍耐', score: 1, sourceIds: [33], tag: 'avoid' },
      { id: 'B', text: '尝试培养', score: 2, sourceIds: [25, 33], tag: 'patient' },
      { id: 'C', text: '调整岗位，让他也有价值', score: 3, sourceIds: [25, 32], tag: 'strategic' },
      { id: 'D', text: '直接开除', score: 4, sourceIds: [6, 32], tag: 'decisive' },
    ],
  },
  {
    id: 26,
    category: 'team',
    text: '你和两个合伙人对公司未来方向产生重大分歧。你认为应该All-in A方向，他们都坚持B方向，并给出了合理的数据支撑。你会？',
    options: [
      { id: 'A', text: '逃避，不做决定', score: 1, sourceIds: [31], tag: 'avoid' },
      { id: 'B', text: '跟随大多数意见', score: 2, sourceIds: [32], tag: 'consensus' },
      { id: 'C', text: '花时间协调沟通', score: 3, sourceIds: [31, 32], tag: 'diplomat' },
      { id: 'D', text: '果断拍板并承担责任', score: 4, sourceIds: [31, 6], tag: 'decisive' },
    ],
  },
  {
    id: 27,
    category: 'team',
    text: '你在团队中通常扮演的角色？',
    options: [
      { id: 'A', text: '独立执行者', score: 1, sourceIds: [34], tag: 'solo-ic' },
      { id: 'B', text: '普通参与者', score: 2, sourceIds: [25], tag: 'participant' },
      { id: 'C', text: '带领者', score: 3, sourceIds: [6, 25], tag: 'leader' },
      { id: 'D', text: '发起人/创始人', score: 4, sourceIds: [6], tag: 'initiator' },
    ],
  },
  {
    id: 28,
    category: 'team',
    text: '如果你要在校园里招募陌生同学加入，你会？',
    options: [
      { id: 'A', text: '完全不敢开口', score: 1, sourceIds: [34], tag: 'shy' },
      { id: 'B', text: '勉强尝试', score: 2, sourceIds: [2], tag: 'reluctant' },
      { id: 'C', text: '可以主动去找人', score: 3, sourceIds: [2, 25], tag: 'proactive' },
      { id: 'D', text: '很擅长说服别人加入', score: 4, sourceIds: [6, 25], tag: 'recruiter' },
    ],
  },
  // ── Long-term ──
  {
    id: 29,
    category: 'longterm',
    text: '如果开发一个产品需要至少2-3年才能成熟，你会？',
    options: [
      { id: 'A', text: '完全不可能投入这么久', score: 1, sourceIds: [35], tag: 'short-term' },
      { id: 'B', text: '最多半年', score: 2, sourceIds: [3], tag: 'impatient' },
      { id: 'C', text: '可以坚持1-2年', score: 3, sourceIds: [3, 30], tag: 'medium-term' },
      { id: 'D', text: '愿意花5年以上', score: 4, sourceIds: [30], tag: 'long-game' },
    ],
  },
  {
    id: 30,
    category: 'longterm',
    text: '你最看重的结果是？',
    options: [
      { id: 'A', text: '短期收益', score: 1, sourceIds: [26], tag: 'short-term' },
      { id: 'B', text: '学到一些经验', score: 2, sourceIds: [7], tag: 'learning' },
      { id: 'C', text: '长期积累', score: 3, sourceIds: [3, 30], tag: 'accumulation' },
      { id: 'D', text: '真正改变一个行业', score: 4, sourceIds: [1, 30], tag: 'transformative' },
    ],
  },
  {
    id: 31,
    category: 'longterm',
    text: '你对责任的理解？',
    options: [
      { id: 'A', text: '只对自己负责', score: 1, sourceIds: [34], tag: 'self-only' },
      { id: 'B', text: '对家人朋友负责', score: 2, sourceIds: [34], tag: 'close-circle' },
      { id: 'C', text: '对团队负责', score: 3, sourceIds: [15, 25], tag: 'team' },
      { id: 'D', text: '对社会和未来负责', score: 4, sourceIds: [30, 6], tag: 'society' },
    ],
  },
  {
    id: 32,
    category: 'longterm',
    text: '如果一个目标需要20年才能实现（比如造火箭、做芯片），投资人不允许你开超过1万的薪资，不允许分红，你会？',
    options: [
      { id: 'A', text: '完全做不到', score: 1, sourceIds: [35], tag: 'impossible' },
      { id: 'B', text: '勉强可以', score: 2, sourceIds: [30], tag: 'reluctant' },
      { id: 'C', text: '可以考虑', score: 3, sourceIds: [30], tag: 'willing' },
      { id: 'D', text: '无所谓，乐意接受', score: 4, sourceIds: [30], tag: 'mission-driven' },
    ],
  },
  // ── Mindset ──
  {
    id: 33,
    category: 'mindset',
    text: '如果创业意味着连续2-3年每天只睡4-5小时，还要长期抗压，你会？',
    options: [
      { id: 'A', text: '完全不可能接受', score: 1, sourceIds: [34], tag: 'no-way' },
      { id: 'B', text: '勉强但内心排斥', score: 2, sourceIds: [34, 30], tag: 'reluctant' },
      { id: 'C', text: '虽然辛苦，但愿意尝试', score: 3, sourceIds: [30], tag: 'willing' },
      { id: 'D', text: '甚至觉得这种节奏有点爽', score: 4, sourceIds: [30], tag: 'thrives' },
    ],
  },
  {
    id: 34,
    category: 'mindset',
    text: '如果你每天独自在办公室工作，连续半年没人陪伴，你会？',
    options: [
      { id: 'A', text: '完全忍受不了', score: 1, sourceIds: [34, 35], tag: 'lonely' },
      { id: 'B', text: '很痛苦但能勉强', score: 2, sourceIds: [34], tag: 'endure' },
      { id: 'C', text: '可以适应', score: 3, sourceIds: [30], tag: 'adapted' },
      { id: 'D', text: '利用独处时间专注工作，主动寻找布道和社交机会', score: 4, sourceIds: [30, 35], tag: 'productive-solo' },
    ],
  },
  {
    id: 35,
    category: 'mindset',
    text: '如果家人朋友强烈反对你创业，你甚至因此失去朋友，父母发怒三个月不跟你沟通，你会？',
    options: [
      { id: 'A', text: '无法接受，先暂停创业', score: 1, sourceIds: [35], tag: 'family-first' },
      { id: 'B', text: '动摇，可能放弃', score: 2, sourceIds: [30], tag: 'shaken' },
      { id: 'C', text: '接受部分代价', score: 3, sourceIds: [30, 34], tag: 'partial-sacrifice' },
      { id: 'D', text: '能接受孤立，牺牲亲友关系，坚持到底', score: 4, sourceIds: [30], tag: 'absolute' },
    ],
  },
  {
    id: 36,
    category: 'mindset',
    text: '如果你要连续3年几乎无假期、每天工作15小时，你会？',
    options: [
      { id: 'A', text: '完全做不到', score: 1, sourceIds: [34], tag: 'impossible' },
      { id: 'B', text: '勉强但可能坚持不住', score: 2, sourceIds: [34, 30], tag: 'doubtful' },
      { id: 'C', text: '可以坚持，只是很痛苦', score: 3, sourceIds: [30], tag: 'endure' },
      { id: 'D', text: '反而觉得这样才有价值', score: 4, sourceIds: [30], tag: 'thrives' },
    ],
  },
  // ── Extreme Scenarios (硬门槛) ──
  {
    id: 37,
    category: 'commitment',
    text: '你拿到一份年薪百万的大厂Offer，入职后可以解决父母的医疗费用和孩子的教育基金。同时一个创业机会急需你立刻投入，启动月薪只有2000元。你会？',
    options: [
      { id: 'A', text: '选工作', score: 1, sourceIds: [35], tag: 'work' },
      { id: 'B', text: '接工作，创业当副业', score: 2, sourceIds: [6], tag: 'side-hustle' },
      { id: 'C', text: '拿Offer但给自己设时限尝试创业', score: 3, sourceIds: [31, 6], tag: 'time-boxed' },
      { id: 'D', text: '放弃Offer，直接创业', score: 4, sourceIds: [30, 6], tag: 'all-in' },
    ],
  },
  {
    id: 38,
    category: 'mindset',
    text: '如果你老婆/家人正在医院生产或心脏搭桥，而此时你公司最重要的客户只在这一小时能见面，关乎公司未来，你会？',
    options: [
      { id: 'A', text: '去医院', score: 1, sourceIds: [34], tag: 'family' },
      { id: 'B', text: '去医院，但尝试兼顾客户', score: 2, sourceIds: [31], tag: 'balance' },
      { id: 'C', text: '权衡后先去见客户，再赶去医院', score: 3, sourceIds: [31, 6], tag: 'business-first' },
      { id: 'D', text: '直接去见客户，把家人交给别人', score: 4, sourceIds: [30], tag: 'absolute-business' },
    ],
  },
  {
    id: 39,
    category: 'resilience',
    text: '产品上线半年只有500用户，钱烧完了，团队辞职过半，剩余团队士气低落，你会？',
    options: [
      { id: 'A', text: '马上放弃', score: 1, sourceIds: [30], tag: 'quit' },
      { id: 'B', text: '拖延观望', score: 2, sourceIds: [30], tag: 'wait' },
      { id: 'C', text: '调整策略，但坚持死磕', score: 3, sourceIds: [30, 28], tag: 'pivot-persist' },
      { id: 'D', text: '同时尝试多个方向直到跑出结果', score: 4, sourceIds: [2, 28], tag: 'multi-test' },
    ],
  },
  {
    id: 40,
    category: 'mindset',
    text: '如果你需要半年时间几乎都住在公司打地铺推进项目，你会？',
    options: [
      { id: 'A', text: '绝对不行', score: 1, sourceIds: [35], tag: 'no-way' },
      { id: 'B', text: '勉强接受', score: 2, sourceIds: [30], tag: 'reluctant' },
      { id: 'C', text: '可以做到', score: 3, sourceIds: [30], tag: 'willing' },
      { id: 'D', text: '很期待', score: 4, sourceIds: [30], tag: 'eager' },
    ],
  },
]

// ── Helpers ──

const CATEGORY_LABELS: Record<string, string> = {
  commitment: '投入决心',
  motivation: '创业动机',
  resilience: '抗压韧性',
  independence: '独立判断',
  execution: '执行力',
  risk: '风险承受',
  team: '团队能力',
  longterm: '长期主义',
  mindset: '心态准备',
}

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category
}

/** Pick N random questions from the pool, balanced across categories */
export function pickQuestions(count: number): readonly QuickQuestion[] {
  // Group by category
  const byCategory = new Map<string, QuickQuestion[]>()
  for (const q of QUICK_QUESTIONS) {
    const list = byCategory.get(q.category) ?? []
    list.push(q)
    byCategory.set(q.category, list)
  }

  // Shuffle each category
  for (const [, list] of byCategory) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = list[i]
      list[i] = list[j]
      list[j] = tmp
    }
  }

  // Round-robin pick from each category
  const categories = [...byCategory.keys()]
  const picked: QuickQuestion[] = []
  let catIndex = 0

  while (picked.length < count) {
    const cat = categories[catIndex % categories.length]
    const list = byCategory.get(cat)!
    if (list.length > 0) {
      picked.push(list.shift()!)
    }
    catIndex++
    // If all categories exhausted, break
    if ([...byCategory.values()].every((l) => l.length === 0)) break
  }

  return picked
}

/** Analyze quick answers - returns category scores and highlighted issues */
export function analyzeQuickAnswers(answers: readonly QuickAnswer[]): {
  categoryScores: Record<string, { total: number; count: number; avg: number }>
  weakCategories: readonly string[] // categories with avg score < 2.5
  strongCategories: readonly string[] // categories with avg score >= 3.5
  totalScore: number
  maxScore: number
  highlightedQuestions: readonly { questionId: number; score: number; category: string }[] // questions where user scored 1 (weakest)
} {
  const categoryScores: Record<string, { total: number; count: number; avg: number }> = {}

  // Find question categories
  const questionMap = new Map<number, QuickQuestion>()
  for (const q of QUICK_QUESTIONS) {
    questionMap.set(q.id, q)
  }

  let totalScore = 0
  const maxScore = answers.length * 4
  const highlightedQuestions: { questionId: number; score: number; category: string }[] = []

  for (const answer of answers) {
    const question = questionMap.get(answer.questionId)
    if (!question) continue

    totalScore += answer.score

    if (!categoryScores[question.category]) {
      categoryScores[question.category] = { total: 0, count: 0, avg: 0 }
    }
    categoryScores[question.category].total += answer.score
    categoryScores[question.category].count += 1

    // Track lowest-scoring answers
    if (answer.score <= 1) {
      highlightedQuestions.push({
        questionId: answer.questionId,
        score: answer.score,
        category: question.category,
      })
    }
  }

  // Calculate averages
  for (const [, data] of Object.entries(categoryScores)) {
    data.avg = data.count > 0 ? data.total / data.count : 0
  }

  const weakCategories = Object.entries(categoryScores)
    .filter(([, d]) => d.avg < 2.5)
    .map(([cat]) => cat)

  const strongCategories = Object.entries(categoryScores)
    .filter(([, d]) => d.avg >= 3.5)
    .map(([cat]) => cat)

  return {
    categoryScores,
    weakCategories,
    strongCategories,
    totalScore,
    maxScore,
    highlightedQuestions,
  }
}
