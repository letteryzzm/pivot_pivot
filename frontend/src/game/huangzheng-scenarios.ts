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
      '小学毕业，你因为奥数得奖被推荐考进了一所外语学校。但你一看名字就不想去——你喜欢数理化，觉得这学校就是学外语的。你跟老师说不去，校长亲自来劝。另一边，你心仪的那所理科强校也在招生，你完全够格。',
    choices: [
      { id: '1a', text: '听校长的安排，去外语学校', isHuangzheng: true },
      { id: '1b', text: '坚持自己的判断，去理科学校', isHuangzheng: false },
      { id: '1c', text: '两边都去实地看看再说', isHuangzheng: false },
    ],
    huangzhengChoice: '1a',
    huangzhengSay:
      '黄峥本来想去数理化强的中学，但被校长劝说后去了杭州外国语学校。后来回想："还好去了！"杭外六年让他比同龄人更早接受西方文化影响，12到18岁和160个同学朝夕相处，形成了完全不一样的价值观。有时候别人的判断比你自己的更准。',
    tag: '格局胆识',
  },
  {
    id: 2,
    year: '~2002',
    title: '大学六年',
    description:
      '从中学到大学，你一路追求成绩第一，是标准的"好学生"。周围有同学在谈恋爱、搞社团、到处玩。期末考试你永远是最拼的那个。你觉得这样的大学过得怎么样？',
    choices: [
      { id: '2a', text: '很值——年轻时拼学业，以后才有更多选择', isHuangzheng: true },
      { id: '2b', text: '有点亏——青春就该用来折腾，不是刷绩点', isHuangzheng: false },
      { id: '2c', text: '学业和生活都要抓，不偏科也不偏人生', isHuangzheng: false },
    ],
    huangzhengChoice: '2a',
    huangzhengSay:
      `黄峥当时就是全力追求第一的那个人。但多年后他反思这是"不小的遗憾"："自己目标导向太明确，在追求第一上浪费了过多的时间，损失了很多逆反、捣蛋、纯粹享受青春的时光。'60分万岁是个好哲学'是我在很多年后才慢慢悟到的。"`,
    tag: '认知深度',
  },
  {
    id: 3,
    year: '~1999',
    title: '一个国际基金会的邀请',
    description:
      '大一时，一个国际基金会在你的学院选5个人，入选后每年飞到一个国家跟印度、智利、东德、美国的同龄人一起生活十天，平时要保持邮件联系。但这会占掉你大量课余时间——你的同学正在泡实验室、争奖学金、刷论文。',
    choices: [
      { id: '3a', text: '去——跟不同国家的人混在一起，哪怕牺牲一些绩点', isHuangzheng: true },
      { id: '3b', text: '不去——实验室和论文才是硬功夫，时间有限', isHuangzheng: false },
      { id: '3c', text: '不去——把精力放在准备出国读研上，去了国外自然有交流机会', isHuangzheng: false },
    ],
    huangzhengChoice: '3a',
    huangzhengSay:
      '黄峥大一就加入了Melton Foundation。"它让我深刻意识到，世界上不同的人种、不同的文化是如此的不同。他们的出发点、思考问题的方式和做事情的方式，是我之前完全不知道、也很难想象的。"一个副产品是他很早就习惯了印度英语，后来在Google跟印度同事协作毫无障碍。',
    tag: '格局胆识',
  },

  // ====== 职业抉择 ======
  {
    id: 4,
    year: '2004',
    title: '两个offer',
    description:
      '研究生毕业，手上有两个offer。一个是微软，你实习过，熟悉环境，能看到自己十年后做到什么位置。另一个是一家叫Google的公司，成立六年，还没上市，你不太了解内部情况。有个你信任的前辈说这公司不错，建议你去看看。',
    choices: [
      { id: '4a', text: '去微软——熟悉、稳定，路径清晰', isHuangzheng: false },
      { id: '4b', text: '去Google——前辈推荐的，去见识一下', isHuangzheng: true },
      { id: '4c', text: '都不急着定，再看看别的机会', isHuangzheng: false },
    ],
    huangzhengChoice: '4b',
    huangzhengSay:
      '黄峥去了Google。他在Google上市前半年加入，"那时工程师也就几百人"。三年后他才意识到这个机会有多难得："从概率上来说，人一生能碰上一次也算是很幸运的了。至少至少也是十年二十年一遇的机会。"当时他选择Google的理由很简单：导师说值得去，就去了。',
    tag: '格局胆识',
  },
  {
    id: 5,
    year: '~2006',
    title: '账上突然多了很多钱',
    description:
      '公司上市了，你的银行账户突然多了一大笔钱。你还很年轻，这是你第一份工作，没有什么比较。你身边不少同事辞职了——有人学开飞机，有人搞望远镜，有人去创业当老板。',
    choices: [
      { id: '5a', text: '也辞职，趁年轻有钱去尝试更多可能', isHuangzheng: false },
      { id: '5b', text: '先不动，继续在公司干着，看看还能学到什么', isHuangzheng: true },
      { id: '5c', text: '拿这笔钱去做投资，让钱替自己工作', isHuangzheng: false },
      { id: '5d', text: '减少工作时间，先好好享受生活', isHuangzheng: false },
    ],
    huangzhengChoice: '5b',
    huangzhengSay:
      '黄峥没有马上离开。他观察到身边很多人"因为瞬间有了太多的钱，失去了工作的动力，开始去寻找新的乐趣和事业，但往往那些新的东西他其实不擅长也未必喜欢。就这样耽误了好些年，耽误了他最有可能做出更杰出成就的时光。"他的结论是"钱是工具，不是目的"。',
    tag: '价值取舍',
  },
  {
    id: 6,
    year: '2007',
    title: '还有一年的股票',
    description:
      '你在公司待满三年了，但四年期的股票还剩一年没兑现，价值不菲。你一直想创业，现在觉得时机到了。但多留一年就能拿到全部股票。身边的人都说"又不差这一年"。',
    choices: [
      { id: '6a', text: '走，不等了', isHuangzheng: true },
      { id: '6b', text: '再等一年，反正创业也不差这点时间', isHuangzheng: false },
      { id: '6c', text: '留着工作，业余时间先把创业准备做好', isHuangzheng: false },
    ],
    huangzhengChoice: '6a',
    huangzhengSay:
      '黄峥没等四年股票全部兑现就离职了。"这三年对我来说是非常值得的三年。Google给予我的远比我给Google做的贡献要多。"他没有纠结那一年的股票——当你确定要做的事，沉没成本不应该是决定因素。',
    tag: '长期主义',
  },

  // ====== 创业理念 ======
  {
    id: 7,
    year: '~2015',
    title: '在家躺了十个月',
    description:
      '第一次创业做了几年，赚了钱，但你说不上来有什么成就感。你选择休息，在家待了快十个月。这段时间你一直在想一个问题：接下来到底做什么？',
    choices: [
      { id: '7a', text: '看看现在什么赛道最热，快速切入', isHuangzheng: false },
      { id: '7b', text: '先想清楚什么事能让自己真正开心，再决定方向', isHuangzheng: true },
      { id: '7c', text: '不再创业了，转做投资，更轻松回报也不差', isHuangzheng: false },
      { id: '7d', text: '找几个靠谱的合伙人，先把团队攒起来再说', isHuangzheng: false },
    ],
    huangzhengChoice: '7b',
    huangzhengSay:
      '黄峥说带来深层幸福感的有两件事："第一个就是很深度地和一帮自己喜欢的小伙伴披荆斩棘创造一个什么东西。第二是希望能做一件社会影响力更大一些的事，一定程度上能够促进良币驱逐劣币的发生。"他先想清楚了"为什么"，然后才选了方向。',
    tag: '社会使命',
  },
  {
    id: 8,
    year: '~2015',
    title: '两个创业方向',
    description:
      '你面前有两类生意。一类是成熟赛道，利润可预期，风险可控，很多人在做。另一类是改变农产品流通——中国的水果蔬菜从产地到餐桌要经过层层中间商，品质好的反而卖不上价，品质差的靠低价横行。后者更难，失败概率更高。',
    choices: [
      { id: '8a', text: '做成熟赛道——先保证活下来，再谈理想', isHuangzheng: false },
      { id: '8b', text: '做农产品——难度大但一旦做成壁垒也高', isHuangzheng: true },
      { id: '8c', text: '先做成熟赛道赚钱，再投入农产品', isHuangzheng: false },
    ],
    huangzhengChoice: '8b',
    huangzhengSay:
      '黄峥选了农产品。他认为"三聚氰胺为什么会出现？本质上是劣币驱逐良币。"他相信"一个好的公司应该去花力气解决/克服那些正确又难的问题，而不是四处捡一大堆芝麻。"如果一个业务特别容易做，往往不是长期带来大量现金流的好业务。',
    tag: '价值取舍',
  },
  {
    id: 9,
    year: '~2016',
    title: '一个反常识的模式',
    description:
      '你有一个想法：让消费者不要求"马上发货"，而是多等几天，把需求归集起来形成批量订单，直接对接产地和工厂，价格可以便宜很多。但当时整个电商行业都在卷"次日达""当日达"，你的想法跟行业方向完全相反。',
    choices: [
      { id: '9a', text: '做——价格足够便宜的话，用户愿意等', isHuangzheng: true },
      { id: '9b', text: '不做——用户已经被惯坏了，没人愿意等', isHuangzheng: false },
      { id: '9c', text: '先做快速配送，等站稳了再尝试拼团模式', isHuangzheng: false },
    ],
    huangzhengChoice: '9a',
    huangzhengSay:
      '黄峥提出了"用需求流通侧的半计划经济来推动实现供给侧的半市场经济"。他相信"如果能让前端消费者多一点耐心，放弃一部分所见即所得、现在马上要的冲动，那么我们就有机会利用人和人之间关系做人以群分的归并"。这就是拼多多"拼"模式的底层逻辑。',
    tag: '认知深度',
  },
  {
    id: 10,
    year: '~2016',
    title: '一个关于保险的思考',
    description:
      '你在琢磨一个问题：保险的本质是穷人花钱向富人买确定性。有没有反过来的可能——让普通消费者把自己"我未来要买什么"的确定性卖给工厂？比如一千人提前说要买羽绒服，工厂就能给他们大幅折扣。你觉得这个想法怎么样？',
    choices: [
      { id: '10a', text: '不靠谱——组织一千个人一起下单的成本太高了', isHuangzheng: false },
      { id: '10b', text: '有意思——如果有个平台能把组织成本降到足够低就能成', isHuangzheng: true },
      { id: '10c', text: '理论上对但实际很难——先把眼前的业务做好再说', isHuangzheng: false },
    ],
    huangzhengChoice: '10b',
    huangzhengSay:
      '黄峥写道："每个人对自己的意愿、对于自己在未来某个点的需求和规划往往是比其他人要清楚得多的。这种每个人的规划和意愿，对满足需求的供给方往往是有价值的。"他设想通过平台把消费者的确定性产品化、流通化，实现"反向保险"——这是拼多多商业模式最深层的思想根基。',
    tag: '认知深度',
  },
  {
    id: 11,
    year: '2018',
    title: '公司才三岁',
    description:
      '你的公司成立三年，用户量已经破三亿，但问题也不少：假货投诉、品控不足、外界天天骂。投行来找你谈上市。有人说趁势头好赶紧上，有人说问题这么多上市是找骂。',
    choices: [
      { id: '11a', text: '先解决品控问题，等口碑好了再上市', isHuangzheng: false },
      { id: '11b', text: '现在就上市，在公众监督下解决问题', isHuangzheng: true },
      { id: '11c', text: '上市融钱，用资金加速解决品控问题', isHuangzheng: false },
    ],
    huangzhengChoice: '11b',
    huangzhengSay:
      '黄峥选择上市，但理由跟"融资"无关。他说："拼多多的业务本来就有很强的社会性，它终将走向公众。在公众的监督下，我们可以成长得更好更强。"他还强调"拼多多不应该是彰显个人能力的工具，也不应该有过多的个人色彩"——上市是为了让公司成为公众机构。',
    tag: '格局胆识',
  },

  // ====== 掌舵与放手 ======
  {
    id: 12,
    year: '2019',
    title: '对手的围剿',
    description:
      '行业巨头开始大规模"二选一"——逼商家只能在你和他之间选一个平台开店。你的商家在被迫撤离，增长受到压制。团队里有人主张正面反击抢商家，有人说应该投诉监管，有人建议避开正面战场。',
    choices: [
      { id: '12a', text: '正面反击——补贴商家，花钱抢回来', isHuangzheng: false },
      { id: '12b', text: '不理他——做好自己的事，时间会证明一切', isHuangzheng: true },
      { id: '12c', text: '向监管部门举报，走法律途径', isHuangzheng: false },
      { id: '12d', text: '绕开他——专注做他不做的下沉市场', isHuangzheng: false },
    ],
    huangzhengChoice: '12b',
    huangzhengSay:
      `黄峥在股东信中写道："所有的这些行为并不产生消费者价值。这种消耗与伤害有时是'杀敌一千，自损两百'。"他选择开放策略——"我们的策略不是从打破一个垄断到创造一个新的垄断，而是从打破一个垄断到提供一个新的选择。"他认为"长期独家排他是必然会被打破的"。`,
    tag: '长期主义',
  },
  {
    id: 13,
    year: '2020',
    title: '要不要交出CEO',
    description:
      '公司高速增长中，你是创始人，最了解这家公司。但公司规模越来越大，你觉得应该让更年轻的人来管日常运营。你在考虑辞去CEO，只保留董事长。外界一定会解读为"出了问题"。',
    choices: [
      { id: '13a', text: '不退——创始人就该亲自带，尤其是高速增长期', isHuangzheng: false },
      { id: '13b', text: '退——让年轻团队接班，自己退到战略层面', isHuangzheng: true },
      { id: '13c', text: '名义上不退，实际上放权给副手', isHuangzheng: false },
    ],
    huangzhengChoice: '13b',
    huangzhengSay:
      '2020年7月1日，黄峥辞去CEO。他在全员信中说："让团队加速成长，让拼多多成为一个更好更强的持续充满创业活力的公司。"同时他捐出2.37%股份成立慈善基金，划出7.74%给合伙人集体。他不是被迫退的，是主动让出的。',
    tag: '格局胆识',
  },
  {
    id: 14,
    year: '2021',
    title: '彻底离开',
    description:
      '辞去CEO不到一年，你又在考虑辞去董事长。你想去做食品科学和生命科学研究。你40出头，公司市值几千亿，正是巅峰期。所有人都觉得你不可能真的走。',
    choices: [
      { id: '14a', text: '不走——公司还有太多事要做，走了谁来把控方向', isHuangzheng: false },
      { id: '14b', text: '走——去做自己真正想做的事', isHuangzheng: true },
      { id: '14c', text: '挂个名，两边都不耽误', isHuangzheng: false },
    ],
    huangzhengChoice: '14b',
    huangzhengSay:
      '黄峥辞去了董事长，放弃了1:10超级投票权，承诺三年不卖股票。他说："要改变就必须在更底层、根本的问题上采取行动，要在核心科技和其基础理论上寻找答案。"他想做的是："成不了科学家，但也许有机会成为未来（伟大）的科学家的助理，那也是一件很幸福的事儿。"',
    tag: '社会使命',
  },
]

export const TOTAL_HZ_QUESTIONS = HUANGZHENG_SCENARIOS.length
