import type { Scenario } from '../types/game.ts'

/**
 * Started path (已经在创业了) question pool:
 * 10 slots x 3 questions each = 30 total.
 * Each playthrough picks one random question per slot.
 */

export const STARTED_POOL: readonly (readonly Scenario[])[] = [
  // ── Slot 1 ──
  [
    {
      id: 1,
      title: '用户不增长',
      description: '产品上线一个月了，每天新增用户不到10个。{name}的第一反应是？',
      choices: [
        { id: '1-1a', text: '产品还不够好，先打磨产品', effects: { judgment: -1, action: -1, cognition: 3, connection: 2 }, clawReaction: '{name}回到了编辑器，开始优化界面。但用户不增长的原因，也许不在产品里。', sourceIds: [35, 27] },
        { id: '1-1b', text: '是不是渠道不对？换个推广方式试试', effects: { judgment: 2, action: 4, cognition: 1, connection: 2 }, clawReaction: '{name}换了一个渠道投放。效果好了一些，但{name}不确定这是运气还是策略。', sourceIds: [6, 3] },
        { id: '1-1c', text: '去问那10个留下来的用户：你为什么还在用？', effects: { judgment: 3, action: 4, cognition: 4, connection: 5 }, clawReaction: '{name}和10个用户逐一聊了。发现他们留下的原因，和{name}以为的完全不一样。', sourceIds: [6, 3] },
        { id: '1-1d', text: '有可能方向本身就不对，先暂停增长，回去验证需求', effects: { judgment: 3, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}按下了暂停键。不是放弃，而是回到原点——这个问题，真的存在吗？', sourceIds: [6, 3] },
      ],
    },
    {
      id: 1,
      title: '用户要的太多',
      description: '核心用户提了20个功能需求，每个都说\'很重要\'。{name}的工程师只有1个。{name}会？',
      choices: [
        { id: '1-2a', text: '按用户说的优先级一个一个做', effects: { judgment: -2, action: 2, cognition: -1, connection: 5 }, clawReaction: '{name}做了三个月，20个功能做了5个。用户还是不满意，因为真正的问题不在功能多少。', sourceIds: [1, 32] },
        { id: '1-2b', text: '找出被提最多次的3个需求，只做这3个', effects: { judgment: 3, action: 3, cognition: 4, connection: 2 }, clawReaction: '{name}做了统计。发现20个需求里有15个其实是同一个问题的不同表述。', sourceIds: [6, 3] },
        { id: '1-2c', text: '不看他们说什么，看他们的行为数据——在哪个环节流失最多', effects: { judgment: 4, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}拉了漏斗数据。发现80%的用户在第三步就走了。做什么功能都不如修好这一步。', sourceIds: [6, 3] },
        { id: '1-2d', text: '只做那1个如果不做用户就会走的功能', effects: { judgment: 4, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}问了一个残酷的问题：如果只能做一件事，做什么？答案瞬间清晰了。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 1,
      title: '合伙人划水',
      description: '{name}的合伙人最近明显投入变少了，但{name}不确定是因为他有其他事还是对项目失去了信心。{name}会？',
      choices: [
        { id: '1-3a', text: '再观察一段时间', effects: { judgment: 2, action: 2 }, clawReaction: '{name}又等了两周。情况没有变好，反而更差了。回避问题从来不会让问题消失。', sourceIds: [20, 27] },
        { id: '1-3b', text: '找机会旁敲侧击问一下', effects: { judgment: 2, action: 2, connection: 5 }, clawReaction: '{name}试探了几次，但对方总是说\'没事，最近就是有点忙\'。旁敲侧击拿到的永远是表面答案。', sourceIds: [1, 32] },
        { id: '1-3c', text: '直接坐下来摊牌：\'你现在是什么状态？\'', effects: { judgment: 5, action: 3, cognition: 1, connection: 5 }, clawReaction: '{name}约了一个咖啡。开门见山。对方沉默了一会儿，然后说了实话。真相不好听，但至少知道了。', sourceIds: [6, 3] },
        { id: '1-3d', text: '不管他什么状态，关键决策和核心进展都由我来推', effects: { judgment: 3, action: 3, cognition: 1, connection: -1 }, clawReaction: '{name}默默把核心工作接了过来。合伙人注意到了，主动来找{name}谈了。', sourceIds: [30, 28] },
      ],
    },
  ],

  // ── Slot 2 ──
  [
    {
      id: 2,
      title: '定价难题',
      description: '{name}不知道该怎么定价。免费怕不可持续，收费怕吓走用户。{name}会？',
      choices: [
        { id: '2-1a', text: '先免费，等用户量上来再说', effects: { judgment: -1, action: -1, cognition: 3, connection: 2 }, clawReaction: '{name}选择了免费。用户来了不少，但没有一个人觉得这个产品\'值钱\'。免费培养不出付费习惯。', sourceIds: [35, 27] },
        { id: '2-1b', text: '问用户愿意付多少', effects: { judgment: 2, action: 2, cognition: 3, connection: 5 }, clawReaction: '{name}问了20个用户。答案从0到500都有。但{name}注意到一件事——说0的人用得最少，说500的人用得最多。', sourceIds: [6, 3] },
        { id: '2-1c', text: '直接定一个价格上去，看数据反应', effects: { judgment: 3, action: 4, cognition: 3, connection: 2 }, clawReaction: '{name}定了99元/月。第一周走了30%的用户，但留下的70%的使用频率翻了一倍。付费筛选了真需求。', sourceIds: [6, 3] },
        { id: '2-1d', text: '给前100个用户免费，第101个开始收费', effects: { judgment: 4, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}用免费期收集了100个真实用户的数据和反馈。到了收费的那天，{name}已经知道该定多少钱了。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 2,
      title: '技术债',
      description: '为了快速上线，{name}的代码写得很糙。现在每加一个功能都要花3倍时间。{name}会？',
      choices: [
        { id: '2-2a', text: '停下来重构一个月', effects: { judgment: 2, action: -1, cognition: 4, connection: 2 }, clawReaction: '{name}花了一个月重构。代码漂亮了，但这一个月没有任何用户增长。完美的代码不等于成功的产品。', sourceIds: [31, 26] },
        { id: '2-2b', text: '边做新功能边慢慢还债', effects: { judgment: 2, action: 3, cognition: 3, connection: 2 }, clawReaction: '{name}每做一个新功能就顺手优化周围的代码。三个月后，代码质量和产品功能都在进步。', sourceIds: [6, 3] },
        { id: '2-2c', text: '不管代码，先把增长做起来，有钱了招人重写', effects: { judgment: 3, action: 4, cognition: -1, connection: 2 }, clawReaction: '{name}选择了速度。代码越来越乱，但用户在涨。这是一种赌注——赌增长能跑过技术债。', sourceIds: [6, 3] },
        { id: '2-2d', text: '只重构影响用户体验最大的那个模块', effects: { judgment: 4, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}找到了那20%影响80%体验的代码。两天重构完，用户满意度立刻提升了。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 2,
      title: '竞品出现',
      description: '{name}发现一个YC团队在做跟自己几乎一样的产品，而且他们融了500万美金。{name}会？',
      choices: [
        { id: '2-3a', text: '完了，我们打不过', effects: { judgment: -3, action: -3 }, clawReaction: '{name}的心沉了下去。但500万美金并不能自动变成好产品——钱只是燃料，方向盘还是在人手里。', sourceIds: [35, 27] },
        { id: '2-3b', text: '仔细研究他们的产品，找差异化', effects: { judgment: 2, action: 3, cognition: 4, connection: 2 }, clawReaction: '{name}注册了对方的产品，像素级对比。发现他们做得很\'全\'但不够\'深\'——这就是机会。', sourceIds: [6, 3] },
        { id: '2-3c', text: '加速——他们验证了需求，现在是速度竞赛', effects: { judgment: 3, action: 4, cognition: 1, connection: 2 }, clawReaction: '{name}的开发节奏翻了一倍。竞争对手最大的贡献就是帮你证明了赛道是对的。', sourceIds: [6, 3] },
        { id: '2-3d', text: '去找他们的用户聊，看看他们有什么不满', effects: { judgment: 3, action: 4, cognition: 4, connection: 5 }, clawReaction: '{name}在对方的社区里泡了三天。找到了12条抱怨。这12条抱怨，就是{name}的产品路线图。', sourceIds: [6, 3] },
      ],
    },
  ],

  // ── Slot 3 ──
  [
    {
      id: 3,
      title: '用户投诉',
      description: '一个重要客户在群里公开吐槽{name}的产品\'太烂了\'，其他用户开始跟风。{name}会？',
      choices: [
        { id: '3-1a', text: '赶紧删帖或控制影响', effects: { judgment: -2, action: 2, connection: -1 }, clawReaction: '{name}删了那条消息。但截图已经传开了。删帖永远比发帖传得快。', sourceIds: [35, 27] },
        { id: '3-1b', text: '公开道歉，承诺改进', effects: { judgment: 2, action: 2, connection: 5 }, clawReaction: '{name}在群里发了一段诚恳的回复。大多数人表示理解，但那个客户没有再说话。', sourceIds: [1, 32] },
        { id: '3-1c', text: '私聊这个用户，详细了解到底哪里让他这么生气', effects: { judgment: 4, action: 4, cognition: 4, connection: 5 }, clawReaction: '{name}打了40分钟电话。发现他不是在抱怨产品，而是在抱怨一次失败的客服体验。问题比想象的小，但教训比想象的大。', sourceIds: [6, 3] },
        { id: '3-1d', text: '当天就修复他提到的最大问题，把修复截图发到群里', effects: { judgment: 3, action: 4, cognition: 1, connection: 5 }, clawReaction: '{name}连夜修复了问题，把前后对比截图发到群里。那个客户回了一条：\'这速度可以。\'行动是最好的道歉。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 3,
      title: '招人难',
      description: '{name}需要招一个核心工程师，但给不起市场价。{name}能给的只有低薪加股份加愿景。{name}会？',
      choices: [
        { id: '3-2a', text: '等赚到钱再招', effects: { action: -2 }, clawReaction: '{name}继续一个人扛。但有些事情不是时间能解决的——你需要互补的人。', sourceIds: [35, 27] },
        { id: '3-2b', text: '找实习生或兼职先凑合', effects: { judgment: 2, action: 2, connection: 2 }, clawReaction: '{name}找了两个实习生。效率不高，但至少不是一个人了。有时候\'凑合\'也是一种智慧。', sourceIds: [2, 3] },
        { id: '3-2c', text: '用你的项目本身吸引人——让他看到产品、用户反馈、增长曲线', effects: { judgment: 3, action: 3, cognition: 3, connection: 5 }, clawReaction: '{name}做了一份产品demo，配上真实用户的截图和数据。有一个候选人看完说：\'什么时候开始？\'', sourceIds: [6, 3] },
        { id: '3-2d', text: '在开源社区和技术论坛里找对这个方向有热情的人', effects: { judgment: 2, action: 3, cognition: 3, connection: 5 }, clawReaction: '{name}在一个技术论坛发了帖。三天后收到了一封邮件：\'我做了一个类似的side project，我们聊聊？\'', sourceIds: [6, 3] },
      ],
    },
    {
      id: 3,
      title: '方向质疑',
      description: '投资人见了{name}，说\'这个方向太小了，做不大\'。{name}会？',
      choices: [
        { id: '3-3a', text: '他可能说得对，考虑换方向', effects: { action: -2, cognition: 1 }, clawReaction: '{name}开始犹豫了。但一个投资人的\'太小了\'，不代表真的小——可能只是他看不到大的路径。', sourceIds: [35, 27] },
        { id: '3-3b', text: '记住他的反馈，但不轻易改变', effects: { judgment: 2, action: 2, cognition: 3, connection: 2 }, clawReaction: '{name}把他的话记在了本子上。好的反馈需要消化，不需要立刻反应。', sourceIds: [31, 26] },
        { id: '3-3c', text: '回去算一笔账：如果每个用户付X元，市场到底有多大', effects: { judgment: 4, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}花了一天做市场规模估算。发现一个有趣的事：从下往上算出来的数字，比投资人从上往下看到的要大得多。', sourceIds: [6, 3] },
        { id: '3-3d', text: '跟他说\'Uber一开始也只是旧金山的黑车\'——小切口不等于小市场', effects: { judgment: 4, action: 2, cognition: 4, connection: 5 }, clawReaction: '投资人笑了。他见过太多吹大市场的人，第一次见到能把\'小市场\'讲出逻辑的。', sourceIds: [6, 3] },
      ],
    },
  ],

  // ── Slot 4 ──
  [
    {
      id: 4,
      title: '指标选择',
      description: '{name}的产品现在有三个数据：用户数1000，日活100，付费率2%。{name}最关注哪个？',
      choices: [
        { id: '4-1a', text: '用户数——要先有量', effects: { judgment: -1, action: 2, connection: 2 }, clawReaction: '{name}开始猛拉新。用户数涨到了3000，但日活还是100。量不等于价值。', sourceIds: [1, 32] },
        { id: '4-1b', text: '日活——用的人多说明产品好', effects: { judgment: 2, action: 2, cognition: 4, connection: 2 }, clawReaction: '{name}开始优化活跃度。发现一个关键：让用户每天打开的理由，和他们注册的理由完全不同。', sourceIds: [6, 3] },
        { id: '4-1c', text: '付费率——愿意付钱说明真的需要', effects: { judgment: 3, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}聚焦在那2%的付费用户身上。和他们一个个聊，发现他们有一个共同点——这个产品帮他们省了大量时间。', sourceIds: [6, 3] },
        { id: '4-1d', text: '不看绝对值，看趋势——这三个数在涨还是跌', effects: { judgment: 4, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}画了三条趋势线。发现用户数在涨，日活在跌，付费率持平。诊断出来了：拉来的人不对。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 4,
      title: '大客户诱惑',
      description: '一个大客户说\'我给你50万，但你要花3个月专门给我做定制功能\'。{name}的产品本来是面向通用市场的。{name}会？',
      choices: [
        { id: '4-2a', text: '接，先活下来', effects: { judgment: 2, action: 2, cognition: -1, connection: 5 }, clawReaction: '{name}拿了50万。三个月后做完了定制功能，但通用产品三个月没进展。更麻烦的是，这个客户开始觉得你是他的外包了。', sourceIds: [1, 32] },
        { id: '4-2b', text: '接，但把定制功能设计成可以复用的模块', effects: { judgment: 3, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}接了单，但花了额外的心思把功能做成通用的。50万赚到了，产品也进步了。这才是真正的杠杆思维。', sourceIds: [6, 3] },
        { id: '4-2c', text: '不接，定制化会让产品方向跑偏', effects: { judgment: 3, action: 3, cognition: 4, connection: -1 }, clawReaction: '{name}拒绝了50万。很痛，但三个月后通用产品获得了10个新客户，每个月付5万。长期账赢了。', sourceIds: [31, 26] },
        { id: '4-2d', text: '谈判：接一半定制，另一半做通用功能，价格降到30万', effects: { judgment: 4, action: 3, cognition: 3, connection: 5 }, clawReaction: '{name}和客户谈了一个双赢方案。对方觉得你专业，你觉得对方合理。好的deal不是零和游戏。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 4,
      title: '联创离开',
      description: '{name}的联合创始人说：\'我决定离开了，这件事花的时间比我预期的久太多。\'{name}会？',
      choices: [
        { id: '4-3a', text: '崩溃，觉得天塌了', effects: { judgment: -2, action: -3, connection: -2 }, clawReaction: '{name}一个人坐在电脑前发呆了一下午。联创走了，像是左膀右臂被砍掉了一只。', sourceIds: [35, 27] },
        { id: '4-3b', text: '尊重他的选择，但谈好股权交接', effects: { judgment: 3, action: 2, cognition: 1, connection: 5 }, clawReaction: '{name}花了一周处理交接。谈判很难，但{name}坚持了一件事：干净利落，不留隐患。', sourceIds: [6, 3] },
        { id: '4-3c', text: '冷静下来后开始想：我一个人能不能继续？哪些必须找人补？', effects: { judgment: 3, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}列了一张能力清单。发现缺的不是人，是他在做的那个具体的事情。找到替代比找到联创容易。', sourceIds: [6, 3] },
        { id: '4-3d', text: '当天就开始找接替他的人', effects: { judgment: 3, action: 4, connection: 5 }, clawReaction: '{name}下午就发了三条招聘信息。晚上收到了两份简历。悲伤可以有，但不能耽误事。', sourceIds: [6, 3] },
      ],
    },
  ],

  // ── Slot 5 ──
  [
    {
      id: 5,
      title: '现金流危机',
      description: '这个月收入2万，支出5万。如果不改变，3个月后钱就花完了。{name}的优先行动是？',
      choices: [
        { id: '5-1a', text: '立刻融资', effects: { judgment: 2, action: 4, connection: 5 }, clawReaction: '{name}开始见投资人。但投资人看到你的现金流就皱眉了——在最脆弱的时候融资，拿到的条件最差。', sourceIds: [6, 3] },
        { id: '5-1b', text: '砍掉一切非必要支出', effects: { judgment: 3, action: 3, cognition: 3, connection: 2 }, clawReaction: '{name}把办公室退了，取消了所有订阅，砍了零食预算。支出从5万降到了2万。活着才有后面的事。', sourceIds: [6, 3] },
        { id: '5-1c', text: '先把收入从2万提到4万——怎么提？这个月就想办法', effects: { judgment: 4, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}花了三天想出了一个新的变现方案。这个月收入涨到了3万8。差距还在，但曲线变了。', sourceIds: [6, 3] },
        { id: '5-1d', text: '同时做：砍支出、提收入、见投资人', effects: { judgment: 4, action: 4, cognition: 3, connection: 5 }, clawReaction: '{name}启动了三线作战。很累，但{name}发现危机反而让自己做出了平时不敢做的决定。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 5,
      title: '被大厂碾压',
      description: '某大厂发布了一个免费产品，功能跟{name}的核心功能几乎一样。团队士气崩了。{name}会？',
      choices: [
        { id: '5-2a', text: '考虑关闭，打不过大厂', effects: { judgment: -1, action: -3, cognition: 1 }, clawReaction: '{name}看了看那个大厂产品的评论区，全是好评。但仔细看——好评来自普通用户，不是{name}的目标客户。', sourceIds: [35, 27] },
        { id: '5-2b', text: '冷静分析：我们的用户会因此走吗？测试一下', effects: { judgment: 3, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}给所有付费用户发了消息。90%说\'我知道那个产品，但它不解决我的具体问题\'。松了一口气。', sourceIds: [6, 3] },
        { id: '5-2c', text: '立刻往更垂直的场景切，做大厂不愿意做的脏活', effects: { judgment: 4, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}带着团队转向了一个更窄、更深的场景。大厂做不了这种脏活——他们追求的是规模，不是深度。', sourceIds: [6, 3] },
        { id: '5-2d', text: '给团队开一个坦诚的会，把情况讲清楚，一起想出路', effects: { judgment: 3, action: 3, cognition: 3, connection: 5 }, clawReaction: '{name}用了一个小时跟团队摊牌。没有画饼，只有数据。会议结束时，团队反而比之前更团结了。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 5,
      title: '数据造假的诱惑',
      description: '准备融资，{name}的数据看起来\'还行\'但不够\'性感\'。有人建议{name}\'包装\'一下数据。{name}会？',
      choices: [
        { id: '5-3a', text: '适当包装，大家都这么做', effects: { judgment: -3, action: 1, cognition: -2, connection: 2 }, clawReaction: '{name}改了几个数字。融资成功了，但接下来每一天都在为那个谎活着——因为数据要兑现。', sourceIds: [35, 27] },
        { id: '5-3b', text: '不造假，但选最好看的角度呈现', effects: { judgment: 2, action: 2, cognition: 1, connection: 2 }, clawReaction: '{name}用最好的口径展示了数据。投资人问了一些尖锐问题，{name}都回答了。这是一个灰色但安全的地带。', sourceIds: [2, 3] },
        { id: '5-3c', text: '数据是什么就是什么，如果不够好就继续做到够好', effects: { judgment: 3, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}跟投资人说了实话。三个人拒绝了，一个人说\'你的诚实让我印象深刻\'。那一个就够了。', sourceIds: [6, 3] },
        { id: '5-3d', text: '直接告诉投资人真实数据和你的判断——诚实本身就是筛选标准', effects: { judgment: 4, action: 4, cognition: 3, connection: 5 }, clawReaction: '{name}用诚实筛选了投资人。愿意在数据不完美时相信你的人，才是你真正需要的投资人。', sourceIds: [6, 3] },
      ],
    },
  ],

  // ── Slot 6 ──
  [
    {
      id: 6,
      title: '团队分裂',
      description: '团队里两个核心成员闹矛盾，已经影响到工作了。一个技术强但脾气差，一个协作好但效率低。{name}必须做决定。{name}会？',
      choices: [
        { id: '6-1a', text: '谁都不选，希望他们自己解决', effects: { judgment: -2, action: -2 }, clawReaction: '{name}选择了回避。一个月后两个人都提了离职。回避是最差的管理方式。', sourceIds: [35, 27] },
        { id: '6-1b', text: '分别谈话，调解矛盾', effects: { judgment: 2, action: 1, cognition: 1, connection: 5 }, clawReaction: '{name}花了两天分别聊。发现矛盾不是性格问题，是职责边界不清。重新划分了分工后，情况好转了。', sourceIds: [1, 32] },
        { id: '6-1c', text: '留技术强的，让另一个换岗位或离开', effects: { judgment: 4, action: 3, cognition: 3, connection: -2 }, clawReaction: '{name}做了一个残酷但理性的选择。留下来的人效率明显提升了。管理就是不断做不舒服的决定。', sourceIds: [30, 28] },
        { id: '6-1d', text: '不看人，看哪个角色对现阶段的公司更关键', effects: { judgment: 4, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}画了一个能力矩阵。发现现阶段最缺的是执行速度，不是团队氛围。答案自然就出来了。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 6,
      title: '投资人压力',
      description: '投资人说：\'如果下个季度DAU不到5万，我们考虑撤资。\'但{name}觉得现在应该专注留存而不是拉新。{name}会？',
      choices: [
        { id: '6-2a', text: '听投资人的，先把数字做上去', effects: { judgment: -2, action: 2, cognition: -1, connection: 2 }, clawReaction: '{name}花了一个季度猛拉新。DAU到了4万8，但留存率从30%掉到了10%。数字好看了，但产品更虚了。', sourceIds: [20, 27] },
        { id: '6-2b', text: '跟投资人解释你的逻辑，试图说服他', effects: { judgment: 3, action: 3, cognition: 4, connection: 5 }, clawReaction: '{name}准备了一份详细的分析报告给投资人看。投资人说\'你的逻辑说得通，但我需要看到结果\'。', sourceIds: [6, 3] },
        { id: '6-2c', text: '不跟投资人争，用一个月的时间用留存数据证明你是对的', effects: { judgment: 3, action: 4, cognition: 3, connection: 2 }, clawReaction: '{name}一个月后拿着数据去找投资人：留存率从30%涨到了50%，用户的使用时长翻了3倍。投资人说\'继续\'。', sourceIds: [6, 3] },
        { id: '6-2d', text: '做好他撤资的准备——如果他不理解你的判断，这笔钱不要也罢', effects: { judgment: 4, action: 4, cognition: 4, connection: -1 }, clawReaction: '{name}开始准备plan B。一个不信任你判断的投资人，比没钱更危险。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 6,
      title: '核心员工被挖',
      description: '{name}最重要的工程师收到了大厂的offer，薪水是这里的3倍。他来找{name}谈。{name}会？',
      choices: [
        { id: '6-3a', text: '祝福他，放人走', effects: { judgment: 2, action: -1, connection: 5 }, clawReaction: '{name}握了握手说\'去吧\'。格局是有了，但这个人走了，产品迭代速度直接砍半。', sourceIds: [1, 32] },
        { id: '6-3b', text: '加薪挽留，哪怕财务上很紧', effects: { judgment: 2, action: 2, cognition: -1, connection: 5 }, clawReaction: '{name}咬牙涨了50%的薪水。他留下了，但公司的现金流更紧了。', sourceIds: [1, 32] },
        { id: '6-3c', text: '不谈钱，谈这件事的意义和他在其中的角色', effects: { judgment: 3, action: 3, cognition: 3, connection: 5 }, clawReaction: '{name}花了两小时跟他聊。不画饼，只说了一件事：这件事做成了，你不只是一个工程师，而是一个联合创始人级别的人。他说\'让我想想\'。', sourceIds: [6, 3] },
        { id: '6-3d', text: '坦诚告诉他现在公司的真实情况和你的计划，让他自己选', effects: { judgment: 4, action: 4, cognition: 4, connection: 5 }, clawReaction: '{name}把公司的账本、用户数据、融资计划全都打开给他看。他看了一个小时，说\'我留下\'。真正留人的不是钱，是信任。', sourceIds: [6, 3] },
      ],
    },
  ],

  // ── Slot 7 ──
  [
    {
      id: 7,
      title: '身体崩溃',
      description: '{name}已经连续三个月每天工作16小时。某天早上在工位上晕倒了。醒来后{name}会？',
      choices: [
        { id: '7-1a', text: '该停下来了', effects: { judgment: 2, action: -3, cognition: 3, connection: 2 }, clawReaction: '{name}把电脑合上了。休息了两周。公司没有因此倒闭——这本身就说明了一个问题。', sourceIds: [31, 26] },
        { id: '7-1b', text: '休息一周，重新规划节奏', effects: { judgment: 3, action: 3, cognition: 4, connection: 2 }, clawReaction: '{name}用这一周重新设计了自己的工作方式。发现之前有40%的时间在做不重要的事。', sourceIds: [6, 3] },
        { id: '7-1c', text: '找出哪些工作可以交出去，自己只做最关键的决策', effects: { judgment: 4, action: 4, cognition: 4, connection: 5 }, clawReaction: '{name}第一次真正学会了\'授权\'。发现团队其实一直在等{name}放手。', sourceIds: [6, 3] },
        { id: '7-1d', text: '这是系统问题——公司不能只靠我一个人，必须建团队', effects: { judgment: 4, action: 4, cognition: 5, connection: 5 }, clawReaction: '{name}意识到了创业者最重要的转变：从\'我能做什么\'到\'我该让谁来做什么\'。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 7,
      title: '错误的方向',
      description: '做了6个月后{name}开始怀疑：也许一开始的方向就是错的。但已经投入了这么多。{name}会？',
      choices: [
        { id: '7-2a', text: '继续做，已经投入这么多了不能浪费', effects: { judgment: -3, action: 1, cognition: -2 }, clawReaction: '{name}继续投入。三个月后数据证实了——方向确实是错的。又浪费了三个月。沉没成本谬误是创业者最大的敌人。', sourceIds: [35, 27] },
        { id: '7-2b', text: '一边做一边小规模测试新方向', effects: { judgment: 3, action: 3, cognition: 4, connection: 2 }, clawReaction: '{name}用20%的精力测了三个新方向。其中一个的数据，第一周就比老方向六个月的还好。', sourceIds: [6, 3] },
        { id: '7-2c', text: '暂停一切，花一周时间认真复盘：数据说了什么？', effects: { judgment: 4, action: 4, cognition: 5, connection: 2 }, clawReaction: '{name}关了电脑，在笔记本上写了一整天。结论很痛苦但很清晰：核心假设错了。', sourceIds: [6, 3] },
        { id: '7-2d', text: '如果数据确认方向错了，立刻pivot，沉没成本不是成本', effects: { judgment: 5, action: 4, cognition: 5, connection: 2 }, clawReaction: '{name}做了最难的决定——放弃六个月的努力。但{name}知道：方向错了，越坚持越远。pivot不是失败，是进化。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 7,
      title: '账上见底',
      description: '银行余额还能撑6周。团队已经两个月没发全额工资了。{name}会？',
      choices: [
        { id: '7-3a', text: '跟团队说实话，如果6周内没融到钱就解散', effects: { judgment: 3, action: 2, cognition: 1, connection: 5 }, clawReaction: '{name}开了一个坦诚的会。没有人离开，但所有人的眼神都变了——从轻松变成了战时状态。', sourceIds: [6, 3] },
        { id: '7-3b', text: '找3个核心用户，问他们愿不愿意提前付年费', effects: { judgment: 5, action: 4, cognition: 3, connection: 5 }, clawReaction: '{name}给三个用户发了消息。两个人当天就付了年费。这些钱够撑两个月——而且证明了产品有付费价值。', sourceIds: [6, 3] },
        { id: '7-3c', text: '自己出去接外包赚钱补贴公司', effects: { judgment: 2, action: 4, connection: 2 }, clawReaction: '{name}接了一个外包项目。赚了3万块，但也分散了注意力。有时候续命的方式，反而是慢性自杀。', sourceIds: [6, 3] },
        { id: '7-3d', text: '砍到只剩自己一个人，把burn rate降到最低', effects: { judgment: 4, action: 4, cognition: 4, connection: -1 }, clawReaction: '{name}做了最痛苦的选择——让团队走。一个人的时候burn rate几乎是零。用最少的资源，赌最后一次。', sourceIds: [6, 3] },
      ],
    },
  ],

  // ── Slot 8 ──
  [
    {
      id: 8,
      title: '连续6个月没有收入',
      description: '{name}已经连续6个月没有任何个人收入，每月还要支出5000到1万，只能靠借钱撑下去。{name}会？',
      choices: [
        { id: '8-1a', text: '认输，回去找工作还债', effects: { judgment: 2, action: -3, connection: 2 }, clawReaction: '{name}打开了招聘网站。不是认输——是战略撤退。但{name}知道，这次回去和上次不一样。', sourceIds: [20, 27] },
        { id: '8-1b', text: '找一份兼职维持生活，用剩余时间继续做项目', effects: { judgment: 3, action: 2, cognition: 1, connection: 2 }, clawReaction: '{name}白天送外卖，晚上写代码。很苦，但项目没断。有些故事的开头，就是这么狼狈。', sourceIds: [31, 26] },
        { id: '8-1c', text: '把项目做成能收费的状态——哪怕只有1个付费用户也能证明方向对', effects: { judgment: 4, action: 4, cognition: 5, connection: 2 }, clawReaction: '{name}把所有精力聚焦到\'第一笔收入\'上。两周后，一个用户付了99元。99元，是{name}赚过最有意义的一笔钱。', sourceIds: [6, 3] },
        { id: '8-1d', text: '6个月不算什么。问题不是能不能撑住，而是这6个月有没有让我离答案更近', effects: { judgment: 4, action: 5, cognition: 5, connection: 2 }, clawReaction: '{name}不看余额，看进度。如果方向在变清晰，那6个月不是浪费，是学费。最贵的学费，买到的是最值钱的认知。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 8,
      title: '投资人全部拒绝',
      description: '见了15个投资人，全部拒绝了。最常听到的话是\'太早了\'和\'还没看到数据\'。{name}会？',
      choices: [
        { id: '8-2a', text: '也许他们是对的，项目确实太早了', effects: { judgment: 1, action: -2, cognition: 3, connection: 2 }, clawReaction: '{name}开始怀疑自己的节奏。但投资人说\'太早了\'，也可能只是他们的投资阶段不匹配。', sourceIds: [3, 18] },
        { id: '8-2b', text: '不融资了，用自己的钱继续做到有数据', effects: { judgment: 4, action: 3, cognition: 3, connection: 2 }, clawReaction: '{name}不再见投资人了。把见投资人的时间全部用来做产品和见用户。三个月后，数据自己会说话。', sourceIds: [6, 3] },
        { id: '8-2c', text: '分析每个拒绝的理由，找到共性问题，解决后再去', effects: { judgment: 3, action: 4, cognition: 5, connection: 2 }, clawReaction: '{name}发现15个拒绝里有12个提到了同一个问题。解决了这个问题后，下一个投资人当场给了term sheet。', sourceIds: [6, 3] },
        { id: '8-2d', text: '去找第16个。投资本身就是概率游戏', effects: { judgment: 3, action: 4, cognition: 1, connection: 5 }, clawReaction: '{name}又见了5个人。第18个投资人说\'我看好你的韧性\'——给了投资。有时候，坚持本身就是最好的pitch。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 8,
      title: '合伙人背叛',
      description: '{name}的合伙人偷偷带走了客户资源和部分代码，成立了竞品公司。{name}会？',
      choices: [
        { id: '8-3a', text: '打官司', effects: { judgment: 2, action: 1, connection: -1 }, clawReaction: '{name}找了律师。官司打了半年，赢了，但精力全耗在法务上了。赢了官司，输了时间。', sourceIds: [20, 27] },
        { id: '8-3b', text: '愤怒但不纠缠，专注做好自己的', effects: { judgment: 4, action: 3, cognition: 3, connection: -1 }, clawReaction: '{name}发了一个小时的火，然后坐下来继续工作。最好的复仇就是比他做得好。', sourceIds: [30, 28] },
        { id: '8-3c', text: '冷静复盘：客户为什么愿意跟他走？问题可能在我自己', effects: { judgment: 5, action: 4, cognition: 5, connection: 2 }, clawReaction: '{name}做了一件极难的事——把怒火变成反思。发现有些客户确实服务得不够好。背叛是痛的，但教训是真的。', sourceIds: [6, 3] },
        { id: '8-3d', text: '当天就给所有客户打电话，一个一个谈', effects: { judgment: 4, action: 4, cognition: 1, connection: 5 }, clawReaction: '{name}花了三天联系了所有客户。70%的客户说\'我们更信任你\'。在危机中展现出来的行动力，比平时更有说服力。', sourceIds: [6, 3] },
      ],
    },
  ],

  // ── Slot 9 ──
  [
    {
      id: 9,
      title: '核心产品被抄',
      description: '{name}的核心功能被一个融了1亿美金的竞对完整复制了，而且免费开放。{name}会？',
      choices: [
        { id: '9-1a', text: '放弃这个方向', effects: { action: -3 }, clawReaction: '{name}退出了。但一年后发现那个竞对的免费产品做得并不好——因为免费的东西，往往不会被认真做。', sourceIds: [35, 27] },
        { id: '9-1b', text: '把产品往更深的地方做——他们能抄功能，抄不走我对用户的理解', effects: { judgment: 4, action: 5, cognition: 5, connection: 5 }, clawReaction: '{name}做了一件竞对做不到的事：跟100个用户一对一聊了他们的工作流。然后做出了一个只有真正懂用户的人才能设计出来的功能。', sourceIds: [6, 3] },
        { id: '9-1c', text: 'pivot到他们看不上的细分市场', effects: { judgment: 4, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}转向了一个年收入只有5亿的小市场。大公司看不上，但{name}可以在这里做到第一。', sourceIds: [6, 3] },
        { id: '9-1d', text: '跟他们谈合作或被收购', effects: { judgment: 2, action: 2, cognition: 3, connection: 5 }, clawReaction: '{name}给对方创始人发了邮件。对方回了：\'来聊聊。\'有时候最好的竞争策略是合作。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 9,
      title: '法律危机',
      description: '一个前员工起诉了{name}的公司，声称拥有部分知识产权。案件可能要打半年，律师费至少20万。{name}会？',
      choices: [
        { id: '9-2a', text: '和解，花钱买时间', effects: { judgment: 3, action: 1, connection: 2 }, clawReaction: '{name}花了8万和解。痛，但省了半年的精力。有时候花钱买时间是最好的deal。', sourceIds: [31, 26] },
        { id: '9-2b', text: '咨询律师后做判断，如果有理就打到底', effects: { judgment: 3, action: 3, cognition: 4, connection: 2 }, clawReaction: '{name}找了律师评估。有70%的胜率。决定打。半年后赢了，但也累了。', sourceIds: [6, 3] },
        { id: '9-2c', text: '让律师处理法律的事，自己不分心，继续推进业务', effects: { judgment: 5, action: 4, cognition: 3, connection: 2 }, clawReaction: '{name}做了分工：律师管官司，{name}管公司。在混乱中保持主线不断，这是创始人最重要的能力。', sourceIds: [6, 3] },
        { id: '9-2d', text: '把这件事当作团队管理的教训——以后所有协议必须提前签好', effects: { judgment: 4, action: 4, cognition: 5, connection: 2 }, clawReaction: '{name}吃一堑长一智。重新审计了所有合同和协议。以后每一个人入职的第一天，就签好一切。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 9,
      title: '团队集体辞职',
      description: '团队里5个人中有3个同时提出辞职。剩下{name}和另一个人。{name}会？',
      choices: [
        { id: '9-3a', text: '这公司完了', effects: { judgment: -3, action: -3, connection: -2 }, clawReaction: '{name}的世界塌了。但公司不是团队，公司是使命。人可以换，使命不能丢。', sourceIds: [35, 27] },
        { id: '9-3b', text: '搞清楚他们为什么走——是钱？方向？还是对我不满？', effects: { judgment: 4, action: 4, cognition: 4, connection: 5 }, clawReaction: '{name}和三个人分别聊了。两个人说\'太累了\'，一个人说\'不相信这个方向\'。真正的原因不一样——不能用同一种方式挽留。', sourceIds: [6, 3] },
        { id: '9-3c', text: '两个人也能打仗。砍掉不必要的业务线，聚焦一个点', effects: { judgment: 4, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}把三条产品线砍到了一条。两个人的效率反而比五个人的时候更高——因为不用开会了。', sourceIds: [6, 3] },
        { id: '9-3d', text: '从用户社区里找到最活跃的人，邀请他们加入', effects: { judgment: 3, action: 4, cognition: 1, connection: 5 }, clawReaction: '{name}在用户群里发了一条招聘。一个用户说\'我一直想加入你们\'。最懂你产品的人，就在你的用户里。', sourceIds: [6, 3] },
      ],
    },
  ],

  // ── Slot 10 ──
  [
    {
      id: 10,
      title: '至暗时刻',
      description: '凌晨三点，{name}独自坐在空荡荡的办公室里。账上没钱了，合伙人走了，用户在流失。{name}在想什么？',
      choices: [
        { id: '10-1a', text: '我为什么要走到这一步', effects: { judgment: -1, action: -2, cognition: 1 }, clawReaction: '{name}开始后悔了。但后悔是最没用的情绪——它既不能改变过去，也不能帮助未来。', sourceIds: [35, 27] },
        { id: '10-1b', text: '还有没有我没看到的出路？', effects: { judgment: 2, action: 4, cognition: 3, connection: 2 }, clawReaction: '{name}在白板上画了一个小时。画到最后，发现了一条之前完全没想过的路。至暗时刻，有时候是灵感最强的时刻。', sourceIds: [6, 3] },
        { id: '10-1c', text: '只要还有1个用户在用，这件事就没有死', effects: { judgment: 4, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}打开了后台。还有23个用户今天登录了。{name}给其中一个发了条消息：\'谢谢你还在用。\'对方秒回了一个竖大拇指。', sourceIds: [6, 3] },
        { id: '10-1d', text: '就算这次失败了，我学到的东西足够支撑下一次', effects: { judgment: 4, action: 4, cognition: 5, connection: 2 }, clawReaction: '{name}开始写复盘笔记。写了三页。每一条失败都变成了教训。{name}知道了：第一次创业最值钱的不是公司，是你自己的成长。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 10,
      title: '最后的选择',
      description: '有人出价500万收购{name}的公司。这笔钱可以还清所有债务，还能剩下一些。但{name}知道产品还有潜力。{name}会？',
      choices: [
        { id: '10-2a', text: '卖了，落袋为安', effects: { judgment: 1, action: 1, connection: 2 }, clawReaction: '{name}签了合同。还清债务后还剩80万。朋友说\'恭喜\'，但{name}的心里空了一块。', sourceIds: [1, 32] },
        { id: '10-2b', text: '跟他谈更高的价格', effects: { judgment: 3, action: 1, connection: 5 }, clawReaction: '{name}谈到了800万。对方说\'这是最终报价\'。谈判桌上，{name}学到的比课堂上十年都多。', sourceIds: [1, 32] },
        { id: '10-2c', text: '不卖——如果产品有潜力，500万只是个开始', effects: { judgment: 4, action: 4, cognition: 5, connection: 2 }, clawReaction: '{name}拒绝了500万。周围人都觉得{name}疯了。但{name}看到了他们看不到的数据：用户增长曲线在变陡。', sourceIds: [6, 3] },
        { id: '10-2d', text: '取决于一件事：用户数据是在涨还是在跌？数据决定答案', effects: { judgment: 4, action: 5, cognition: 5, connection: 2 }, clawReaction: '{name}不感情用事。拉了最近三个月的数据：用户在涨、留存在涨、付费在涨。答案很清楚——不卖。', sourceIds: [6, 3] },
      ],
    },
    {
      id: 10,
      title: '如果重来',
      description: '经历了所有这些之后——失败、背叛、至暗时刻、身体崩溃——如果时光倒流，{name}还会选择创业吗？',
      choices: [
        { id: '10-3a', text: '不会，代价太大了', effects: { judgment: 1, action: -2, cognition: 3, connection: 2 }, clawReaction: '{name}摇了摇头。代价确实太大了。但{name}也知道，这两年的成长密度，是上班十年都比不上的。', sourceIds: [3, 18] },
        { id: '10-3b', text: '会，但我会做很多不一样的选择', effects: { judgment: 3, action: 4, cognition: 5, connection: 2 }, clawReaction: '{name}列了一张\'如果重来\'的清单。这张清单本身，就是最值钱的创业经验。', sourceIds: [6, 3] },
        { id: '10-3c', text: '会。每一次失败都让我成为了更好的创业者', effects: { judgment: 4, action: 4, cognition: 5, connection: 2 }, clawReaction: '{name}的眼神平静而坚定。创业真正改变的，不是世界，是你自己。', sourceIds: [6, 3] },
        { id: '10-3d', text: '不只是会——我现在就在准备第二次了', effects: { judgment: 5, action: 4, cognition: 4, connection: 2 }, clawReaction: '{name}笑了。上一次创业教会了{name}：怎么找问题、怎么验证、怎么管人、怎么面对失败。第二次，{name}已经不一样了。', sourceIds: [6, 3] },
      ],
    },
  ],
]
