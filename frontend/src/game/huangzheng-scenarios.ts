/**
 * 黄峥创业人生选择题
 * 基于黄峥公众号文章和致股东信的真实经历
 */

export interface HzChoice {
  id: string
  text: string
  isHuangzheng: boolean // 是否是黄峥的实际选择
}

export interface HzScenario {
  id: number
  year: string
  title: string
  description: string
  choices: HzChoice[]
  huangzhengChoice: string // 黄峥选择的choice id
  huangzhengSay: string // 黄峥的原话/思考
  tag: HzTag
}

export type HzTag = '长期主义' | '价值取舍' | '认知深度' | '格局胆识' | '社会使命'

export const HZ_TAGS: Record<HzTag, { label: string; color: string }> = {
  '长期主义': { label: '长期主义', color: 'text-emerald-400' },
  '价值取舍': { label: '价值取舍', color: 'text-blue-400' },
  '认知深度': { label: '认知深度', color: 'text-purple-400' },
  '格局胆识': { label: '格局胆识', color: 'text-amber-400' },
  '社会使命': { label: '社会使命', color: 'text-rose-400' },
}

export const HUANGZHENG_SCENARIOS: HzScenario[] = [
  // ====== 早期成长 ======
  {
    id: 1,
    year: '~1990',
    title: '一封录取通知书',
    description:
      '你是一个小学刚毕业的孩子，因为奥数得奖被推荐去考了一所外语学校。拿到录取通知书后，你发现这是一所以外语为主的中学，而你更喜欢数理化。另一所数理化强的中学也在招生。你怎么选？',
    choices: [
      { id: '1a', text: '去外语学校——既然考上了，说明是缘分，况且校长也在劝你', isHuangzheng: true },
      { id: '1b', text: '去数理化强的中学——要跟着自己的兴趣走', isHuangzheng: false },
      { id: '1c', text: '再了解一下两所学校的具体情况再决定', isHuangzheng: false },
    ],
    huangzhengChoice: '1a',
    huangzhengSay:
      '黄峥本来想去数理化强的中学，但被小学校长劝说后去了杭州外国语学校。后来回想："还好去了！"杭外的六年让他比同龄人更早接受西方文化影响，形成了不一样的价值观和世界观。有时候，命运的安排比你的计划更好。',
    tag: '格局胆识',
  },
  {
    id: 2,
    year: '~2002',
    title: '追求第一的代价',
    description:
      '从中学到大学，你一直是那种目标导向极其明确的人——追求成绩第一，努力做一个"好学生"。但你身边有些同学在享受青春、逆反、捣蛋、谈恋爱。你开始隐约觉得，自己在"追求第一"上可能花了太多时间。你怎么看？',
    choices: [
      { id: '2a', text: '继续追求第一——年轻时就应该全力以赴，以后有的是时间享受', isHuangzheng: false },
      { id: '2b', text: '开始接受"60分万岁"的哲学——人生不只是KPI', isHuangzheng: true },
      { id: '2c', text: '两者兼顾——在保持优秀的同时也要享受生活', isHuangzheng: false },
    ],
    huangzhengChoice: '2b',
    huangzhengSay:
      `黄峥后来反思："自己目标导向太明确，在追求第一上，在努力做一个好学生上浪费了过多的时间，损失了很多逆反、捣蛋、纯粹享受青春的时光。'60分万岁是个好哲学'是我在很多年后才慢慢悟到的。"`,
    tag: '认知深度',
  },
  {
    id: 3,
    year: '~1999',
    title: '一个改变视野的机会',
    description:
      '大一时，你有机会加入一个国际青年基金会。每年飞到不同国家，和印度、智利、东德、美国的同龄人一起生活十天。条件是入选后你需要用邮件和其他国家的人长期保持联系。你身边的同学都在忙着刷GPA和准备考研。你去不去？',
    choices: [
      { id: '3a', text: '去——这种跨文化的体验比GPA更有长期价值', isHuangzheng: true },
      { id: '3b', text: '不去——大学时间宝贵，先打好专业基础', isHuangzheng: false },
      { id: '3c', text: '看看能不能两年后再申请，现在先把基础打好', isHuangzheng: false },
    ],
    huangzhengChoice: '3a',
    huangzhengSay:
      '黄峥大一就加入了Melton Foundation。这个基金会"让我深刻地意识到，世界上不同的人种、不同的文化是如此的不同。他们的出发点、思考问题的方式和做事情的方式，是我之前完全不知道、也很难想象的。"一个副产品是他很早就习惯了印度英语，对他后来在Google和印度同事协作帮助很大。',
    tag: '格局胆识',
  },

  // ====== 职业抉择 ======
  {
    id: 4,
    year: '2004',
    title: '稳定 vs 未知',
    description:
      '研究生毕业，你在微软实习过，能看到自己十年后的样子——稳定、体面、可预期。同时有一家刚成立不久的公司向你发了offer，叫Google，还没上市，前途未卜。你的人生导师说："这家公司看起来挺牛的，值得去看看。去的话至少待三年。"你怎么选？',
    choices: [
      { id: '4a', text: '留微软——大公司稳定，发展路径清晰', isHuangzheng: false },
      { id: '4b', text: '去Google——听导师的话，去一个看不清未来但可能很厉害的地方', isHuangzheng: true },
      { id: '4c', text: '两个offer都拿着，再多面几家再决定', isHuangzheng: false },
    ],
    huangzhengChoice: '4b',
    huangzhengSay:
      '黄峥听从导师建议去了Google。他在Google上市前半年加入，"那时的人还不太多，工程师也就几百人"。Google在很短时间内给了他财务自由。但他说真正意识到这个机会有多难得，是在离开Google三四年后："从概率上来说，人一生能碰上一次也算是很幸运的了。至少至少也是十年二十年一遇的机会。"',
    tag: '格局胆识',
  },
  {
    id: 5,
    year: '~2006',
    title: '一夜暴富之后',
    description:
      '公司上市了，你的银行账户瞬间多了很多钱。你身边的同事有人开始学开飞机，有人搞望远镜，有人去创业当老板但其实不适合。很多人失去了工作动力，在寻找新乐趣的过程中耽误了好几年。你拿到这笔钱后，怎么想？',
    choices: [
      { id: '5a', text: '钱到手了，该享受就享受，人生苦短', isHuangzheng: false },
      { id: '5b', text: '这笔钱是工具不是目的，继续专注做自己擅长且喜欢的事', isHuangzheng: true },
      { id: '5c', text: '用这笔钱去投资，让钱生钱', isHuangzheng: false },
      { id: '5d', text: '马上辞职创业，趁有资本赶紧干', isHuangzheng: false },
    ],
    huangzhengChoice: '5b',
    huangzhengSay:
      '黄峥观察到："因为瞬间有了太多的钱，很多人失去了工作的动力，开始去寻找新的乐趣和事业，但往往那些新的东西他其实不擅长也未必喜欢。就这样林林总总耽误了好些年，耽误了他最有可能做出更杰出成就的时光。"他的结论是"钱是工具，不是目的"。',
    tag: '价值取舍',
  },
  {
    id: 6,
    year: '2007',
    title: '股票没兑现，但想走',
    description:
      '你在公司待了三年，四年的股票还没全部兑现。但你一直想创业，导师当初说的"至少待三年"已经到了。继续待下去，每多一年都有大量股票到账。你走不走？',
    choices: [
      { id: '6a', text: '走——三年够了，再待下去就是为了钱在耗时间', isHuangzheng: true },
      { id: '6b', text: '再等一年——把股票全部兑现再走，创业也不差这一年', isHuangzheng: false },
      { id: '6c', text: '边工作边准备创业，等股票兑完再正式离职', isHuangzheng: false },
    ],
    huangzhengChoice: '6a',
    huangzhengSay:
      '黄峥没等四年股票全部兑现就离职了。"这三年对我来说是非常值得的三年。Google给予我的远比我给Google做的贡献要多。"他不是为了钱离开，也不是为了钱留下。当确定自己要走的时候，沉没成本不应该是决定因素。',
    tag: '长期主义',
  },

  // ====== 创业理念 ======
  {
    id: 7,
    year: '~2015',
    title: '第一次创业后的空窗期',
    description:
      '你第一次创业做了几年，赚了钱但没有太大成就感。你选择休息，在家待了快十个月。这段时间你开始思考一个问题：你创业到底是为了什么？再次创业，你选择什么方向？',
    choices: [
      { id: '7a', text: '找一个风口赛道，用之前积累的经验和资源快速切入', isHuangzheng: false },
      { id: '7b', text: '做一件让自己深层幸福的事——和喜欢的人一起，做有社会影响力的事', isHuangzheng: true },
      { id: '7c', text: '做投资算了，创业太累，用资本去撬动更大的回报', isHuangzheng: false },
    ],
    huangzhengChoice: '7b',
    huangzhengSay:
      '黄峥说带来深层幸福感的有两件事："第一个就是很深度地和一帮自己喜欢的小伙伴披荆斩棘创造一个什么东西。第二是对拼好货这件事来讲，我是希望能够做一件跟原来相比社会影响力更大一些的事，一定程度上能够促进良币驱逐劣币的发生。"',
    tag: '社会使命',
  },
  {
    id: 8,
    year: '~2015',
    title: '选赛道：容易的还是难的',
    description:
      '你在考虑创业方向。有一些容易做的生意摆在面前——利润不错、风险可控。但你同时看到一个更难的方向：改变农产品流通的方式，让自然熟的、少用药的水果能卖出更好的价格，而不是被"劣币"挤出市场。你怎么选？',
    choices: [
      { id: '8a', text: '先做容易的——先活下来再说，有了资本再去做难的事', isHuangzheng: false },
      { id: '8b', text: '做难但正确的事——如果能让良币驱逐劣币，这本身就是壁垒', isHuangzheng: true },
      { id: '8c', text: '两个都做——用容易的生意养难的项目', isHuangzheng: false },
    ],
    huangzhengChoice: '8b',
    huangzhengSay:
      '黄峥选择了农产品。"三聚氰胺为什么会出现？本质上是一个消费者倒逼的过程，是劣币驱逐良币。"他认为"一个好的公司应该去花力气解决/克服那些正确又难的问题，而不是四处捡一大堆芝麻。"好的决定往往是艰难的，需要付出痛的代价的。',
    tag: '价值取舍',
  },
  {
    id: 9,
    year: '~2016',
    title: '一个反常识的商业模式',
    description:
      '你有一个大胆的想法：让消费者多等几天，把零散的个人需求归集成批量订单，直接对接工厂或农户，省掉中间环节，大幅降价。但这意味着用户要放弃"所见即所得、马上就要"的习惯。身边的人都说电商就是要快，你这是逆势而行。你敢不敢赌？',
    choices: [
      { id: '9a', text: '敢——消费者如果能便宜30%，等几天完全可以接受', isHuangzheng: true },
      { id: '9b', text: '不敢——用户习惯很难改变，电商就是拼速度', isHuangzheng: false },
      { id: '9c', text: '小范围测试一下，验证了再大规模推', isHuangzheng: false },
    ],
    huangzhengChoice: '9a',
    huangzhengSay:
      '黄峥提出了"用需求流通侧的半计划经济来推动实现供给侧的半市场经济"。他相信"如果能让前端消费者多一点耐心及和其他人协调的愿望，放弃一部分所见即所得、现在马上要的冲动，那么我们就有机会利用人和人之间关系做人以群分的归并"。这就是拼多多"拼"模式的底层逻辑。',
    tag: '认知深度',
  },
  {
    id: 10,
    year: '~2016',
    title: '把资本主义倒过来',
    description:
      '你在思考一个更深层的问题：传统保险是穷人花钱向富人买安全感，钱从穷人流向富人。有没有可能反过来——让普通消费者把自己的"购买意愿和确定性"卖给商家和工厂，从而让钱从富人流向穷人？比如一千个人提前表达了买羽绒服的意愿，工厂就给他们30%的折扣。',
    choices: [
      { id: '10a', text: '这个想法太理想化了，消费者不会为了打折去组织和等待', isHuangzheng: false },
      { id: '10b', text: '思路很好，但需要一个平台来降低组织成本——这就是我要做的事', isHuangzheng: true },
      { id: '10c', text: '有道理，但先做好基本的电商业务再考虑这种哲学层面的事', isHuangzheng: false },
    ],
    huangzhengChoice: '10b',
    huangzhengSay:
      '黄峥写道："每个人对自己的意愿、对于自己在未来某个点的需求和规划往往是比其他人要清楚得多的。而且这种每个人的规划和意愿，对满足需求的供给方往往是有价值的。"他设想通过平台把消费者的确定性产品化、流通化，实现"反向保险"——这是拼多多商业模式最深层的思想根基。',
    tag: '认知深度',
  },
  {
    id: 11,
    year: '2018',
    title: '三岁就上市',
    description:
      '你的公司才成立三年，已经有三亿多用户，但身上还有很多问题——假货投诉、品控不足、外界质疑不断。有人建议再打磨几年再上市。但你决定现在就上市。为什么？',
    choices: [
      { id: '11a', text: '不急——先把产品打磨好，等口碑稳了再上市', isHuangzheng: false },
      { id: '11b', text: '上市——业务本来就有社会性，在公众监督下成长更好', isHuangzheng: true },
      { id: '11c', text: '上市——趁估值高赶紧融一轮', isHuangzheng: false },
    ],
    huangzhengChoice: '11b',
    huangzhengSay:
      '黄峥在致股东信中说了三个理由：第一，"拼多多的业务类型本来就有很强的社会性，所以它终将走向公众"。第二，"在公众的监督下，我们可以成长得更好更强"。第三，"我们希望拼多多是一个公众的机构，它不应该是彰显个人能力的工具，也不应该有过多的个人色彩。"',
    tag: '格局胆识',
  },

  // ====== 掌舵与放手 ======
  {
    id: 12,
    year: '2019',
    title: '面对"二选一"的围剿',
    description:
      '你的公司开始威胁到行业巨头的地位。对方开始大规模搞"二选一"——逼迫商家只能在你和他之间选一个平台，否则就下架。你的品牌商在被迫站队，你的增长在被压制。你怎么应对？',
    choices: [
      { id: '12a', text: '正面硬刚——花钱抢商家、打舆论战', isHuangzheng: false },
      { id: '12b', text: '不跟他玩同一个游戏——专注自己的价值，相信藩篱终将被打破', isHuangzheng: true },
      { id: '12c', text: '找监管部门投诉，用法律武器保护自己', isHuangzheng: false },
      { id: '12d', text: '妥协——避其锋芒，做对方不做的市场', isHuangzheng: false },
    ],
    huangzhengChoice: '12b',
    huangzhengSay:
      `黄峥在股东信中写道："所有的这些行为并不产生消费者价值。这种为了争取或维持某种垄断而进行的消耗与伤害有时是'杀敌一千，自损两百'。"他坚持开放策略——"我们的策略不是从打破一个垄断到创造一个新的垄断，而是从打破一个垄断到提供一个新的选择。"他相信"每一次被强迫背后都是一次内心深处反抗力量的增长"。`,
    tag: '长期主义',
  },
  {
    id: 13,
    year: '2020',
    title: '辞去CEO',
    description:
      '公司正在高速增长，你是最了解这家公司的人。但你觉得团队在快速扩张中需要更年轻的领导者来接班，你决定辞去CEO，让联合创始人接任，自己退到董事长的位置。外界会觉得你在最好的时候撤了。你放不放手？',
    choices: [
      { id: '13a', text: '不放——公司正在关键期，创始人不应该这时候退', isHuangzheng: false },
      { id: '13b', text: '放——公司不是彰显个人能力的工具，要让后浪起来', isHuangzheng: true },
      { id: '13c', text: '折中——保留CEO头衔，但把日常管理交给别人', isHuangzheng: false },
    ],
    huangzhengChoice: '13b',
    huangzhengSay:
      '2020年7月1日，黄峥辞去CEO。他在全员信中说："我希望通过这次调整，管理层可以逐步把更多的管理工作和责任交给更年轻的同事，让团队加速成长，让拼多多成为一个更好更强的持续充满创业活力的公司。"同时他捐出2.37%公司股份成立慈善基金。',
    tag: '格局胆识',
  },
  {
    id: 14,
    year: '2021',
    title: '离开商业，转向科研',
    description:
      '辞去CEO不到一年，你又决定辞去董事长，彻底离开公司管理层。你要去做食品科学和生命科学的研究——比如让西红柿含有更适合人体的微量元素，或者研究蛋白质机器人来疏通脑部血管。外界震惊。你身边的人觉得你疯了，正当壮年，为什么不继续做世界级的商业帝国？',
    choices: [
      { id: '14a', text: '继续做商业——拼多多还有巨大的空间，走了太可惜', isHuangzheng: false },
      { id: '14b', text: '去做科研——行业竞争的根本问题要在更底层寻找答案', isHuangzheng: true },
      { id: '14c', text: '两者兼顾——保留董事长，同时做研究', isHuangzheng: false },
    ],
    huangzhengChoice: '14b',
    huangzhengSay:
      '黄峥写道："行业竞争的日益激烈甚至异化让我意识到这种传统的以规模和效率为主要导向的竞争是有其不可避免的问题的。要改变就必须在更底层、根本的问题上采取行动。"他说："小时候想成为科学家，也许已经不太可能了，但如果我努力……成不了科学家，但也许有机会成为未来（伟大）的科学家的助理，那也是一件很幸福的事儿。"',
    tag: '社会使命',
  },
]

export const TOTAL_HZ_QUESTIONS = HUANGZHENG_SCENARIOS.length
