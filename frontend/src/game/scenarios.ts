import type { Scenario } from '../types/game.ts'

/**
 * Question pool: 10 slots x 3-4 questions each.
 * Each playthrough picks one random scenario per slot,
 * preserving the narrative arc while keeping every game unique.
 *
 * Every choice now carries sourceIds and diagnosticTags for the
 * diagnostic system that runs at the end of the game.
 */

const POOL: readonly (readonly Scenario[])[] = [
  // ── Slot 1: 起点 / 发现问题 ──
  [
    {
      id: 1,
      title: '一个普通的下午',
      description:
        '{name}在图书馆刷手机，看到隔壁桌的同学在用Excel手动整理三千条实验数据，已经连续干了两天。{name}脑子里冒出一个想法：这破事儿完全可以用AI自动化啊。但转念一想，自己连代码都不太会写。',
      choices: [
        { id: '1-1a', text: '算了，我又不是学计算机的', effects: { judgment: -2, action: -3, cognition: 1 }, clawReaction: '{name}把手机锁屏了。那个想法像火苗一样灭了。', sourceIds: [55], diagnosticTags: { action_level: 'passive' } },
        { id: '1-1b', text: '先别想能不能做，去问问那些做实验的同学到底有多痛', effects: { judgment: 6, connection: 4, cognition: 2, action: 2 }, clawReaction: '{name}走过去搭话了。那个同学抬起满是黑眼圈的脸，眼睛亮了。', sourceIds: [1, 7], diagnosticTags: { action_level: 'user-first' } },
        { id: '1-1c', text: '打开电脑直接搜教程，今晚就试着写一个', effects: { action: 7, cognition: 3, judgment: 1 }, clawReaction: '{name}打开了一个从没用过的编程工具，开始跟着教程一行行敲。', sourceIds: [2], diagnosticTags: { action_level: 'builder' } },
      ],
    },
    {
      id: 1,
      title: '食堂排队',
      description:
        '中午高峰期，{name}在食堂排了25分钟的队。前面的人都在刷手机抱怨。{name}突然想：如果能提前预约、错峰取餐，食堂的翻台率至少能提升一倍。但这只是个吃饭时的念头。',
      choices: [
        { id: '1-2a', text: '吃完饭就忘了，谁会为这种小事创业', effects: { judgment: -1, action: -2, cognition: 1 }, clawReaction: '{name}吃完红烧肉，那个念头就和米饭一起消化了。', sourceIds: [55], diagnosticTags: { action_level: 'passive' } },
        { id: '1-2b', text: '吃饭时就开始问前后的人：你们每天花多少时间排队？', effects: { judgment: 5, connection: 5, action: 3 }, clawReaction: '{name}端着盘子边吃边聊，吃完时已经记了8个人的痛点。', sourceIds: [1, 7], diagnosticTags: { action_level: 'user-first' } },
        { id: '1-2c', text: '下午就去找食堂经理聊，看看他们有没有这个需求', effects: { action: 6, judgment: 4, connection: 2 }, clawReaction: '食堂经理惊讶地看着这个学生："你居然来问我们？"', sourceIds: [2], diagnosticTags: { action_level: 'builder' } },
      ],
    },
    {
      id: 1,
      title: '深夜对话',
      description:
        '凌晨两点，{name}在刷一个创业者的访谈，对方说"好方向很少靠空想得到，从你反复看见的低效开始"。{name}想到了自己实习时天天手动写周报的经历——那三个小时完全可以被AI替代。',
      choices: [
        { id: '1-3a', text: '记下来，等有空了再研究', effects: { cognition: 3, action: -2, judgment: 1 }, clawReaction: '{name}在备忘录里写了一行字，然后锁屏睡了。这条备忘录再也没被打开过。', sourceIds: [55], diagnosticTags: { action_level: 'passive' } },
        { id: '1-3b', text: '立刻打开ChatGPT，试着让它生成一份周报看看效果', effects: { action: 6, cognition: 4, judgment: 2 }, clawReaction: '{name}花了一小时调prompt，生成的周报居然比自己写的还好。睡意全无。', sourceIds: [2], diagnosticTags: { action_level: 'builder' } },
        { id: '1-3c', text: '第二天就去问之前的同事们：你们每周花多少时间写周报？', effects: { judgment: 5, connection: 4, action: 3 }, clawReaction: '5个前同事都说"至少两小时"。{name}觉得自己摸到了什么。', sourceIds: [1, 7], diagnosticTags: { action_level: 'user-first' } },
      ],
    },
  ],

  // ── Slot 2: 岔路 / 要不要开始 ──
  [
    {
      id: 2,
      title: '岔路口',
      description:
        '期末了。{name}收到一封邮件：某大厂的暑期实习offer。同时，之前聊过的那个想法，有三个同学说"你要是做出来我立刻用"。大厂实习是一条清晰的路，而那个想法连影子都还没有。',
      choices: [
        { id: '2-1a', text: '去实习。先积累经验，以后再创业也不迟', effects: { cognition: 3, connection: 2, action: -2, judgment: -1 }, clawReaction: '{name}发了一条朋友圈："新的开始！"但心里有什么东西在嘀咕。', sourceIds: [55, 48], diagnosticTags: { commitment: 'deferred' } },
        { id: '2-1b', text: '放弃实习。给自己两个月，先做个最小版本验证', effects: { action: 7, judgment: 5, cognition: 2, connection: -1 }, clawReaction: '{name}删掉了那封回复邮件的草稿，打开了一个空白文档。', sourceIds: [12, 2], diagnosticTags: { commitment: 'all-in' } },
        { id: '2-1c', text: '去实习，但用所有业余时间偷偷推进这个想法', effects: { action: 4, cognition: 3, judgment: 2, connection: 1 }, clawReaction: '{name}白天上班晚上搞项目，咖啡当水喝，黑眼圈越来越重。', sourceIds: [12], diagnosticTags: { commitment: 'hedged' } },
      ],
    },
    {
      id: 2,
      title: '考研还是创业',
      description:
        '{name}正在准备考研，但越复习越觉得这不是自己想要的。一个学长说"先读完书再说"，另一个已经在创业的朋友说"你在用准备来逃避开始"。考试还有三个月。',
      choices: [
        { id: '2-2a', text: '先考完再说，万一创业失败至少还有退路', effects: { cognition: 2, judgment: -1, action: -3 }, clawReaction: '{name}重新打开了那本已经翻了三遍的参考书。窗外的天空很远。', sourceIds: [55, 48], diagnosticTags: { commitment: 'deferred' } },
        { id: '2-2b', text: '放弃考研。用这三个月做出第一个可用版本', effects: { action: 7, judgment: 4, cognition: 1, connection: -1 }, clawReaction: '{name}把考研资料打包送给了室友。那一刻意外地轻松。', sourceIds: [12, 2], diagnosticTags: { commitment: 'all-in' } },
        { id: '2-2c', text: '继续考研，但把"验证想法"当成比考研更重要的事', effects: { action: 3, judgment: 3, cognition: 3, connection: 1 }, clawReaction: '{name}每天只花两小时复习，剩下的时间全用来见用户。', sourceIds: [12], diagnosticTags: { commitment: 'hedged' } },
      ],
    },
    {
      id: 2,
      title: '一千块的赌注',
      description:
        '{name}手里只有一千块生活费。一个前辈说"如果你连一千块都不敢赌，就别想创业了"。另一个朋友说"穷的时候更应该保守"。',
      choices: [
        { id: '2-3a', text: '一千块太少了，等攒够钱再开始', effects: { cognition: 1, judgment: -2, action: -3 }, clawReaction: '{name}把钱存进了余额宝。利息每天一毛钱。', sourceIds: [55, 48], diagnosticTags: { commitment: 'deferred' } },
        { id: '2-3b', text: '用500块买域名和服务器，剩下的吃泡面', effects: { action: 7, judgment: 3, cognition: 2 }, clawReaction: '{name}在便利店买了一箱泡面。服务器亮了的那一刻，泡面都变香了。', sourceIds: [12, 2], diagnosticTags: { commitment: 'all-in' } },
        { id: '2-3c', text: '不花钱，用免费工具和人力先跑通流程', effects: { action: 5, judgment: 5, cognition: 3 }, clawReaction: '{name}用免费额度的云服务 + Notion + 微信群搭了一套系统。成本：0元。', sourceIds: [12], diagnosticTags: { commitment: 'hedged' } },
      ],
    },
  ],

  // ── Slot 3: 独立判断 / 面对质疑 ──
  [
    {
      id: 3,
      title: '所有人都说不靠谱',
      description:
        '{name}把想法讲给了10个人听。9个人说"不靠谱"。导师说"你应该先读完研"。爸妈说"别折腾了"。只有一个人说了句："那你试试呗。"',
      choices: [
        { id: '3-1a', text: '9个人都这么说，可能真的不靠谱吧', effects: { judgment: -3, action: -2, cognition: 2, connection: 1 }, clawReaction: '{name}把那个文档关掉了。"大家说的应该有道理。"', sourceIds: [51], diagnosticTags: { independence: 'follower' } },
        { id: '3-1b', text: '不care。他们不理解是因为他们没看到我看到的东西', effects: { judgment: 7, action: 5, cognition: 2, connection: -2 }, clawReaction: '{name}把那9个人的反馈全记了下来，然后继续干。', sourceIds: [48, 50], diagnosticTags: { independence: 'stubborn' } },
        { id: '3-1c', text: '先不争辩，偷偷做一个小验证，用结果说话', effects: { judgment: 4, action: 5, cognition: 3, connection: 2 }, clawReaction: '{name}什么都没说，但那天晚上干到了凌晨四点。', sourceIds: [2, 7], diagnosticTags: { independence: 'evidence' } },
      ],
    },
    {
      id: 3,
      title: '反方向的信号',
      description:
        '{name}发现自己的想法和市面上所有竞品的方向完全相反。行业里的老板们说"市场已经验证了，应该跟着主流走"。但{name}总觉得哪里不对。',
      choices: [
        { id: '3-2a', text: '跟着主流走，毕竟人家都成功了', effects: { cognition: 2, judgment: -3, action: 1 }, clawReaction: '{name}改了方向，做出来一个"更好的竞品"。但心里知道，这不是自己想做的。', sourceIds: [51], diagnosticTags: { independence: 'follower' } },
        { id: '3-2b', text: '找数据和用户反馈验证自己的直觉，再决定', effects: { judgment: 5, cognition: 4, action: 3 }, clawReaction: '{name}花了两周验证。数据说了一个所有人都没注意到的事。', sourceIds: [2, 7], diagnosticTags: { independence: 'evidence' } },
        { id: '3-2c', text: '越是逆势，越想坚持。当所有人都往左的时候，机会在右边', effects: { judgment: 6, action: 5, cognition: 2, connection: -1 }, clawReaction: '{name}在笔记本上写了四个字："逆行而上。"', sourceIds: [48, 50], diagnosticTags: { independence: 'stubborn' } },
      ],
    },
    {
      id: 3,
      title: '导师的忠告',
      description:
        '一个{name}很尊敬的前辈说："你这个年纪应该去大公司锻炼三年，学完方法论再出来创业，成功率会高十倍。"这话听起来特别有道理。',
      choices: [
        { id: '3-3a', text: '前辈说得对，我还太年轻，先去学几年', effects: { cognition: 3, judgment: -2, action: -3, connection: 1 }, clawReaction: '{name}开始投简历。那个想法被放进了"以后再说"的文件夹。', sourceIds: [51], diagnosticTags: { independence: 'follower' } },
        { id: '3-3b', text: '尊重他的经验，但我知道等待不会让风险变小，只会让机会消失', effects: { judgment: 6, action: 4, cognition: 3 }, clawReaction: '{name}认真听完了前辈的话，道了谢，然后回去继续做。', sourceIds: [48, 50], diagnosticTags: { independence: 'stubborn' } },
        { id: '3-3c', text: '去大公司实习一个月，但目的不是学方法论，是近距离看他们的低效在哪', effects: { judgment: 5, cognition: 5, action: 2, connection: 2 }, clawReaction: '{name}在大公司待了一个月，看到了比想象中多十倍的机会。', sourceIds: [2, 7], diagnosticTags: { independence: 'evidence' } },
      ],
    },
  ],

  // ── Slot 4: 验证 / 接触用户 ──
  [
    {
      id: 4,
      title: '前14天',
      description:
        '{name}给自己定了14天的计划：找到20个真实用户，搞清楚他们的痛点。但第一天就发现，找用户比写代码难一百倍。陌生人根本不想理你。',
      choices: [
        { id: '4-1a', text: '在宿舍研究市场报告，线上调研也行吧', effects: { cognition: 3, judgment: 1, action: -2, connection: -1 }, clawReaction: '{name}在宿舍里看了三天报告，离真实用户越来越远。', sourceIds: [1, 39], diagnosticTags: { validation: 'desk-research' } },
        { id: '4-1b', text: '直接去实验室门口蹲点，看到人就搭话', effects: { action: 6, connection: 5, judgment: 3, cognition: 1 }, clawReaction: '{name}被拒绝了7次，但第8个人聊了40分钟，说出了一个关键痛点。', sourceIds: [7, 9], diagnosticTags: { validation: 'direct-user' } },
        { id: '4-1c', text: '在朋友圈发一条："有没有做实验的朋友？请你喝咖啡聊聊"', effects: { connection: 4, action: 3, judgment: 2, cognition: 1 }, clawReaction: '3个人回复了。{name}请了三杯咖啡，记了满满一页纸笔记。', sourceIds: [2], diagnosticTags: { validation: 'network' } },
      ],
    },
    {
      id: 4,
      title: '用户访谈',
      description:
        '{name}终于约到了5个潜在用户来聊。但到底怎么聊？脑子里全是"你觉得我这个产品怎么样"这种问题，但之前看的书说：用户会撒谎，行为不会。',
      choices: [
        { id: '4-2a', text: '直接展示产品原型，问他们会不会用', effects: { action: 3, cognition: 1, judgment: -2, connection: 1 }, clawReaction: '用户们礼貌地说"挺好的"。但{name}总觉得他们没说真话。', sourceIds: [1, 39], diagnosticTags: { validation: 'desk-research' } },
        { id: '4-2b', text: '不提产品。只问他们：最近一次遇到这个问题时，怎么解决的？花了多少时间和钱？', effects: { judgment: 7, cognition: 4, connection: 3 }, clawReaction: '{name}全程没提产品，但听到了比任何产品反馈都值钱的东西。', sourceIds: [7, 9], diagnosticTags: { validation: 'direct-user' } },
        { id: '4-2c', text: '让他们当面操作一遍现在的流程，自己在旁边观察', effects: { judgment: 5, cognition: 5, action: 2, connection: 2 }, clawReaction: '看了三分钟，{name}就发现了用户自己都没意识到的三个效率黑洞。', sourceIds: [7, 8], diagnosticTags: { validation: 'observe' } },
      ],
    },
    {
      id: 4,
      title: '写一页纸',
      description:
        '前辈说："把你要做的事写成一页纸——问题、谁痛、现在怎么解决、你准备先做什么。写不出来说明你还没想清楚。"一页纸听起来简单，但{name}写了三天还不满意。',
      choices: [
        { id: '4-3a', text: '用AI帮忙生成一版，改改就好了', effects: { action: 2, cognition: 1, judgment: -3 }, clawReaction: 'AI写了一版漂亮的文案，但{name}读完发现自己都不信。', sourceIds: [1, 39], diagnosticTags: { validation: 'desk-research' } },
        { id: '4-3b', text: '不急，继续改到自己满意为止', effects: { cognition: 4, judgment: 3, action: -1 }, clawReaction: '{name}改到了第七版，终于觉得每一句话都经得起推敲。', sourceIds: [7, 8], diagnosticTags: { validation: 'observe' } },
        { id: '4-3c', text: '别磨了，把现在这版直接发给10个人，看他们的反应来改', effects: { action: 6, judgment: 4, connection: 3 }, clawReaction: '发出去10分钟，有人回了一句话，比{name}自己想三天都有用。', sourceIds: [2], diagnosticTags: { validation: 'network' } },
      ],
    },
  ],

  // ── Slot 5: MVP / 执行 ──
  [
    {
      id: 5,
      title: '做还是卖',
      description:
        '{name}现在有两个选择。花两个月做一个"像样的产品"再给人用，或者现在就用最土的方法——手动帮三个人处理数据，假装自己是一个自动化系统。',
      choices: [
        { id: '5-1a', text: '先把产品做完美，第一印象很重要', effects: { cognition: 3, action: -3, judgment: -2 }, clawReaction: '{name}精心打磨每一个按钮...两个月后，还在打磨。', sourceIds: [2, 12], diagnosticTags: { execution: 'perfectionist' } },
        { id: '5-1b', text: '先手动帮人干活，验证需求比什么都重要', effects: { action: 6, judgment: 6, cognition: 2, connection: 3 }, clawReaction: '{name}在后台手动处理数据，用户以为是AI在干。"这也太快了吧？"', sourceIds: [2], diagnosticTags: { execution: 'manual-first' } },
        { id: '5-1c', text: '做一个最简陋的版本，丑就丑，能用就行，今天就发', effects: { action: 7, judgment: 3, cognition: 2, connection: 1 }, clawReaction: 'UI丑到不忍直视。但用户说了一句让{name}激动了一整天的话："挺好用的。"', sourceIds: [2, 3], diagnosticTags: { execution: 'ship-fast' } },
      ],
    },
    {
      id: 5,
      title: '两周之约',
      description:
        '{name}给自己定了个deadline：两周内做出第一版。周围的人都觉得疯了："两周？连需求文档都写不完吧。"但{name}想起一句话：别上来就吹牛，先从两周后你能拿到什么反馈开始。',
      choices: [
        { id: '5-2a', text: '两周不够，先花一个月把产品做好', effects: { cognition: 2, action: -3, judgment: -2 }, clawReaction: '一个月过去了。产品很漂亮，但{name}还没给任何用户看过。', sourceIds: [2, 12], diagnosticTags: { execution: 'perfectionist' } },
        { id: '5-2b', text: '先找到一个用户，问他"如果我今天就能帮你解决，你愿意付多少钱？"', effects: { judgment: 7, action: 4, connection: 4 }, clawReaction: '用户说了一个数字。{name}的心跳快了。', sourceIds: [38], diagnosticTags: { execution: 'sell-first' } },
        { id: '5-2c', text: '用现有的免费工具拼出一个最小流程，今天就给人用', effects: { action: 7, cognition: 3, judgment: 2 }, clawReaction: 'Notion + 微信群 + Google表格。丑到爆，但居然跑通了。', sourceIds: [2, 3], diagnosticTags: { execution: 'ship-fast' } },
      ],
    },
    {
      id: 5,
      title: '先卖还是先做',
      description:
        '有人说"聪明的创业者先卖出去再做产品"。{name}纠结了：没有产品怎么卖？但手里有三个很感兴趣的潜在客户，他们说"做出来就买"。',
      choices: [
        { id: '5-3a', text: '先把产品做出来，不能空手套白狼', effects: { cognition: 2, action: -1, judgment: -2, connection: -1 }, clawReaction: '{name}埋头开发了两个月。做出来才发现，客户的需求已经变了。', sourceIds: [2, 12], diagnosticTags: { execution: 'perfectionist' } },
        { id: '5-3b', text: '让他们先付定金。有人掏钱才是真需求', effects: { judgment: 7, connection: 4, action: 4 }, clawReaction: '两个人真的转了钱。{name}知道了一个真理：付费意愿是最诚实的反馈。', sourceIds: [38], diagnosticTags: { execution: 'sell-first' } },
        { id: '5-3c', text: '先帮他们人工做一次，验证了再自动化', effects: { action: 5, judgment: 5, cognition: 3, connection: 2 }, clawReaction: '{name}当了三天"人工AI"。累到崩溃，但也搞清楚了产品该做成什么样。', sourceIds: [2], diagnosticTags: { execution: 'manual-first' } },
      ],
    },
  ],

  // ── Slot 6: 第一次失败 / 挫折 ──
  [
    {
      id: 6,
      title: '第一次失败',
      description:
        '上线三周，总共12个用户。第二周流失了8个。{name}看着后台数据，那条线几乎是平的。合伙人说："要不算了？"',
      choices: [
        { id: '6-1a', text: '也许真的不行，先止损', effects: { judgment: -1, action: -3, cognition: 2, connection: 1 }, clawReaction: '{name}关掉了服务器。"也许大家说得对。"', sourceIds: [48], diagnosticTags: { failure: 'quit' } },
        { id: '6-1b', text: '去找那8个离开的人，一个一个问清楚为什么走', effects: { judgment: 7, cognition: 4, connection: 3, action: 2 }, clawReaction: '{name}打了8个电话。第5个人说了一句话，{name}突然全懂了。', sourceIds: [7, 42], diagnosticTags: { failure: 'diagnose' } },
        { id: '6-1c', text: '数据不够就加倍投入。多试几个方向', effects: { action: 5, judgment: -1, cognition: 1 }, clawReaction: '{name}同时推进三个方向，每个都浅尝辄止。', sourceIds: [46], diagnosticTags: { failure: 'double-down' } },
      ],
    },
    {
      id: 6,
      title: '用户说"不是我要的"',
      description:
        '第一批用户的反馈来了。最痛的一句话："这不是我要的。"有人建议{name}加功能，有人建议换方向。但有一个用户说了句奇怪的话——"{name}做的东西解决了一个我没想到的问题"。',
      choices: [
        { id: '6-2a', text: '用户要什么就做什么，先满足需求', effects: { action: 3, cognition: 1, judgment: -2 }, clawReaction: '{name}疯狂堆功能。产品变成了一个什么都能做但什么都做不好的东西。', sourceIds: [46], diagnosticTags: { failure: 'double-down' } },
        { id: '6-2b', text: '专门去找说"不是我要的"那个人，请他吃饭深聊', effects: { judgment: 6, cognition: 4, connection: 3 }, clawReaction: '{name}拿着笔记本认真记录，听到了完全没想到的东西。', sourceIds: [7, 42], diagnosticTags: { failure: 'diagnose' } },
        { id: '6-2c', text: '关注那个说"解决了没想到的问题"的用户，深挖这条线', effects: { judgment: 7, cognition: 5, connection: 2 }, clawReaction: '{name}发现了一个所有人都忽略的需求缝隙。这可能比原计划更大。', sourceIds: [7, 42], diagnosticTags: { failure: 'diagnose' } },
      ],
    },
    {
      id: 6,
      title: '钱快花完了',
      description:
        '账上只剩五千块。{name}可以再撑一个月。产品有一些用户但还没收入。室友说"你该去找个兼职了"。',
      choices: [
        { id: '6-3a', text: '先找个兼职稳住生活，项目慢慢做', effects: { cognition: 2, action: -2, judgment: -1 }, clawReaction: '{name}开始送外卖。项目更新频率从每天变成了每周。', sourceIds: [48], diagnosticTags: { failure: 'quit' } },
        { id: '6-3b', text: '问三个最活跃的用户：你愿意现在就付费吗？哪怕很少', effects: { judgment: 6, action: 4, connection: 5 }, clawReaction: '有两个人真的付了。金额很小，但{name}第一次觉得这条路走得通。', sourceIds: [38], diagnosticTags: { failure: 'monetize' } },
        { id: '6-3c', text: '找一个付费用户的痛点，做外包式定制，先活下来', effects: { action: 5, judgment: 3, cognition: 2, connection: 3 }, clawReaction: '{name}接了一单定制需求。赚的钱够再撑两个月。', sourceIds: [38], diagnosticTags: { failure: 'monetize' } },
      ],
    },
  ],

  // ── Slot 7: 团队 / 合伙人 ──
  [
    {
      id: 7,
      title: '选人',
      description:
        '{name}需要一个合伙人。面前有两个选择：小王，技术天才，但上次合作因为一个按钮颜色吵了两小时；小李，能力一般，但每次对视都知道对方在想什么。',
      choices: [
        { id: '7-1a', text: '选小王。创业初期，能力就是一切', effects: { cognition: 4, connection: -1, judgment: 1, action: 2 }, clawReaction: '{name}和小王第一天就吵了三次。但代码确实写得好。', sourceIds: [37], diagnosticTags: { team: 'skill-first' } },
        { id: '7-1b', text: '选小李。在小事上不一致的人，大事一定出问题', effects: { connection: 6, judgment: 5, cognition: 1, action: 1 }, clawReaction: '两个人什么都没说，但都知道下一步该做什么。', sourceIds: [26, 53], diagnosticTags: { team: 'trust-first' } },
        { id: '7-1c', text: '谁都不选。一个人能走多远走多远', effects: { action: 4, judgment: 2, connection: -4, cognition: 1 }, clawReaction: '{name}一个人扛着所有。深夜，屏幕的光映在脸上。', sourceIds: [54], diagnosticTags: { team: 'solo' } },
      ],
    },
    {
      id: 7,
      title: '被挖墙脚',
      description:
        '竞争对手用三倍工资挖走了{name}的技术骨干。更扎心的是，那个人走之前说："你的公司看不到未来。"团队士气跌到谷底。',
      choices: [
        { id: '7-2a', text: '很受打击，开始怀疑自己的方向', effects: { cognition: 1, judgment: -2, action: -2, connection: -1 }, clawReaction: '{name}盯着那个人的工位发呆了很久。', sourceIds: [54], diagnosticTags: { team: 'solo' } },
        { id: '7-2b', text: '一个人顶上他的活，让团队看到我不会倒', effects: { action: 6, judgment: 3, connection: 3 }, clawReaction: '{name}连续72小时没睡，把走了的人的工作全补上了。团队安静了，但稳住了。', sourceIds: [37], diagnosticTags: { team: 'skill-first' } },
        { id: '7-2c', text: '当天就发招聘，同时反思：为什么留不住人', effects: { judgment: 5, cognition: 4, connection: 3, action: 2 }, clawReaction: '{name}在笔记本上写了三个问题，最后一个是："我有没有让他们看到未来？"', sourceIds: [26, 53], diagnosticTags: { team: 'trust-first' } },
      ],
    },
    {
      id: 7,
      title: '信任危机',
      description:
        '{name}发现合伙人在背后跟投资人抱怨自己的决策。不是什么大事，但{name}心里很不舒服。要不要当面说？',
      choices: [
        { id: '7-3a', text: '算了，可能他只是压力大，别伤感情', effects: { connection: 1, judgment: -2, action: -1 }, clawReaction: '{name}假装没事。但从那天起，两个人之间多了一层看不见的隔阂。', sourceIds: [54], diagnosticTags: { team: 'solo' } },
        { id: '7-3b', text: '当面聊。有话直说，不绕弯子', effects: { judgment: 5, connection: 4, action: 3, cognition: 2 }, clawReaction: '聊了两小时，很痛但也很真。结束时两个人反而比之前更近了。', sourceIds: [26, 53], diagnosticTags: { team: 'trust-first' } },
        { id: '7-3c', text: '不聊了。如果连信任都没有，该分就分', effects: { action: 5, judgment: 3, connection: -3 }, clawReaction: '{name}当晚发了一条消息："我们聊聊退出的事吧。"', sourceIds: [37], diagnosticTags: { team: 'skill-first' } },
      ],
    },
  ],

  // ── Slot 8: AI / 外部变化 ──
  [
    {
      id: 8,
      title: 'AI来了',
      description:
        '某天早上{name}打开手机，发现一个大模型更新了——它能做到产品70%的功能，而且免费。群里有人@{name}："你们是不是完了？"',
      choices: [
        { id: '8-1a', text: '慌了。这意味着做的东西马上就没价值了', effects: { cognition: 2, action: -4, judgment: -2 }, clawReaction: '{name}失眠了三天，凌晨四点还在刷AI新闻。', sourceIds: [48], diagnosticTags: { adaptation: 'panic' } },
        { id: '8-1b', text: '太好了。砍掉基础功能，把AI嵌进来，只做那30%它做不了的', effects: { cognition: 7, judgment: 6, action: 3, connection: 1 }, clawReaction: '{name}眼睛亮了："它帮我省了半年开发。我只需要做那10%。"', sourceIds: [50, 51], diagnosticTags: { adaptation: 'leverage' } },
        { id: '8-1c', text: '果断转型。这个方向被吃掉了，去做AI原生的东西', effects: { action: 5, cognition: 3, judgment: 1 }, clawReaction: '{name}果断转身。虽然不知道去哪，但先动起来。', sourceIds: [46, 47], diagnosticTags: { adaptation: 'pivot' } },
      ],
    },
    {
      id: 8,
      title: '巨头入场',
      description:
        '字节跳动发布了一个和{name}产品几乎一模一样的功能，免费、精致、流量巨大。朋友圈被刷屏了。{name}的用户群里有人转发了链接，后面跟了一个"……"。',
      choices: [
        { id: '8-2a', text: '完了。大厂做了就没小公司什么事了', effects: { judgment: -3, action: -3, cognition: 1 }, clawReaction: '{name}关掉了手机，在桌前坐了很久。', sourceIds: [48], diagnosticTags: { adaptation: 'panic' } },
        { id: '8-2b', text: '去用他们的产品，找到他们做不好的地方，那就是我的机会', effects: { judgment: 7, cognition: 5, action: 3 }, clawReaction: '{name}注册了大厂的产品，用了一天，笑了——他们根本不懂用户真正的痛点。', sourceIds: [50, 51], diagnosticTags: { adaptation: 'leverage' } },
        { id: '8-2c', text: '砍掉和他们重叠的功能，聚焦到他们不可能做的垂直场景', effects: { judgment: 5, cognition: 4, action: 4 }, clawReaction: '{name}砍掉了60%的功能。产品变小了，但留下来的用户粘性反而翻倍了。', sourceIds: [46, 47], diagnosticTags: { adaptation: 'pivot' } },
      ],
    },
    {
      id: 8,
      title: '风口来了',
      description:
        '{name}做的方向突然成了风口。三个投资人主动联系，媒体来约采访，甚至有人出高价想收购产品。但{name}知道，产品还远没到该有的样子。',
      choices: [
        { id: '8-3a', text: '趁热打铁！赶紧融资、做PR，把声量做起来', effects: { connection: 4, action: 3, judgment: -2 }, clawReaction: '{name}上了三个播客，粉丝涨了五千。但产品的Bug也被放大了五千倍。', sourceIds: [48], diagnosticTags: { adaptation: 'panic' } },
        { id: '8-3b', text: '风口会过去的。忽略噪音，继续打磨产品', effects: { judgment: 6, cognition: 4, action: 2 }, clawReaction: '{name}关掉了所有社交媒体通知，打开了代码编辑器。', sourceIds: [50, 51], diagnosticTags: { adaptation: 'leverage' } },
        { id: '8-3c', text: '选一个最懂行业的投资人深聊，其他人暂时放一放', effects: { judgment: 4, connection: 5, cognition: 3 }, clawReaction: '{name}只见了一个人。那个人给了一个比钱更值钱的建议。', sourceIds: [46, 47], diagnosticTags: { adaptation: 'pivot' } },
      ],
    },
  ],

  // ── Slot 9: 至暗时刻 ──
  [
    {
      id: 9,
      title: '至暗时刻',
      description:
        '连续三个月增长为零。账上只剩两万块。合伙人昨晚发消息说"我拿到了一个大厂offer"。投资人连续被拒了30次。{name}坐在出租屋里，电脑屏幕是唯一的光源。',
      choices: [
        { id: '9-1a', text: '到此为止吧。失败不丢人，但不能再这样下去了', effects: { cognition: 3, judgment: 1, action: -3 }, clawReaction: '{name}把域名续费取消了。"我尽力了。"', sourceIds: [48, 55], diagnosticTags: { resilience: 'quit' } },
        { id: '9-1b', text: '关掉电脑，出门找三个老用户面对面聊', effects: { judgment: 6, connection: 5, cognition: 3, action: 3 }, clawReaction: '{name}坐在用户对面，听到了一句改变一切的话。', sourceIds: [48, 42], diagnosticTags: { resilience: 'persist' } },
        { id: '9-1c', text: '借钱。哪怕借高利贷也要再撑三个月', effects: { action: 7, judgment: -1, connection: -2 }, clawReaction: '{name}签下了一张借条。手在抖，但眼神没有。', sourceIds: [50, 42], diagnosticTags: { resilience: 'structured' } },
      ],
    },
    {
      id: 9,
      title: '最后一根稻草',
      description:
        '爸妈打电话来了。妈妈哭着说"你已经两年没回过家了"。爸爸在旁边说"回来考个公务员吧，别折腾了"。挂了电话，{name}看着天花板，想哭。',
      choices: [
        { id: '9-2a', text: '也许他们是对的。回家吧', effects: { connection: 2, cognition: 1, action: -4, judgment: -2 }, clawReaction: '{name}订了一张回家的票。走出出租屋的时候，回头看了一眼那张书桌。', sourceIds: [48, 55], diagnosticTags: { resilience: 'quit' } },
        { id: '9-2b', text: '含着泪继续干。但今晚先给妈妈回个电话，好好聊聊', effects: { connection: 4, action: 4, judgment: 3, cognition: 2 }, clawReaction: '电话聊了两小时。妈妈最后说了句："那你注意身体。"', sourceIds: [48, 42], diagnosticTags: { resilience: 'persist' } },
        { id: '9-2c', text: '给自己最后三个月期限。如果跑不出来，就回去。但这三个月要拼命', effects: { action: 6, judgment: 5, cognition: 2 }, clawReaction: '{name}在日历上圈了一个日期。那天之前，不回头。', sourceIds: [50, 42], diagnosticTags: { resilience: 'structured' } },
      ],
    },
    {
      id: 9,
      title: '午夜复盘',
      description:
        '凌晨三点，{name}在做复盘。项目上线半年，用了12万，只有47个活跃用户。如果在大厂上班，这段时间至少能赚30万。这笔账怎么算都是亏的。',
      choices: [
        { id: '9-3a', text: '不亏。这半年学到的东西比任何工作经历都多', effects: { cognition: 5, judgment: 4, action: 1 }, clawReaction: '{name}在笔记本上列了自己这半年学会的东西，写了整整三页。', sourceIds: [41, 44], diagnosticTags: { resilience: 'reflect' } },
        { id: '9-3b', text: '问题出在哪？47个用户里，谁留得最久、用得最深？答案在他们身上', effects: { judgment: 7, cognition: 4, connection: 3 }, clawReaction: '{name}打开了后台，一个用户连续用了180天，每天都用。{name}决定明天就去找这个人。', sourceIds: [48, 42], diagnosticTags: { resilience: 'persist' } },
        { id: '9-3c', text: '是我的方向错了。但不是从零开始，而是用这半年的认知去做一个更对的事', effects: { judgment: 5, cognition: 5, action: 3 }, clawReaction: '{name}把旧项目的代码存了档，打开了一个新文件夹。这次不一样了。', sourceIds: [50, 42], diagnosticTags: { resilience: 'structured' } },
      ],
    },
  ],

  // ── Slot 10: 终局 / 选择 ──
  [
    {
      id: 10,
      title: '一年后',
      description:
        '产品终于跑起来了。200个付费用户，每周增长5%。一家大公司出价收购——足够还清所有债务，还能赚一笔。但{name}心里知道，这个产品还远远没到它该到的地方。',
      choices: [
        { id: '10-1a', text: '接了。第一次创业最值钱的不是钱，是判断力的形成', effects: { cognition: 5, judgment: 5, connection: 3, action: 1 }, clawReaction: '签完合同那天，{name}没有庆祝。而是打开了一个新的空白文档。', sourceIds: [3, 12, 41], diagnosticTags: { ending: 'growth' } },
        { id: '10-1b', text: '拒了。被拒100次还继续坚持的人，才可能做出改变世界的东西', effects: { action: 7, judgment: 4, cognition: 2 }, clawReaction: '{name}挂掉电话，转身面对空荡荡的办公室："我们继续。"', sourceIds: [3, 12, 41], diagnosticTags: { ending: 'growth' } },
        { id: '10-1c', text: '谈个好价格，但不是为了退出——是为了拿到资源，加速做下一个更大的事', effects: { judgment: 6, cognition: 4, connection: 4, action: 2 }, clawReaction: '{name}谈了一个所有人都说不可能的条件。然后成了。', sourceIds: [3, 12, 41], diagnosticTags: { ending: 'growth' } },
      ],
    },
    {
      id: 10,
      title: '下一轮',
      description:
        '产品跑了起来，但增长在放缓。投资人说"要么融资加速，要么卖掉"。但{name}看到了一个所有人都没注意到的方向——需要至少两年才能验证，但如果成了，就是一个全新的市场。',
      choices: [
        { id: '10-2a', text: '融资。先拿到钱把已有的方向跑到极致', effects: { action: 4, connection: 4, cognition: 2 }, clawReaction: '{name}在投资人面前讲了一个所有人都喜欢听的故事。但那不是{name}真正想做的。', sourceIds: [48, 55], diagnosticTags: { ending: 'reflect' } },
        { id: '10-2b', text: '不融资。用现有利润养团队，花两年去验证那个无人注意的方向', effects: { judgment: 7, cognition: 5, action: 3, connection: -1 }, clawReaction: '所有人都说{name}疯了。但两年前他们也这么说过。', sourceIds: [3, 12, 41], diagnosticTags: { ending: 'growth' } },
        { id: '10-2c', text: '把现有产品交给团队运营，自己全职去探索新方向', effects: { judgment: 5, action: 5, cognition: 4 }, clawReaction: '{name}把CEO的位置交了出去。"这是我做过最难的决定。"', sourceIds: [3, 12, 41], diagnosticTags: { ending: 'growth' } },
      ],
    },
    {
      id: 10,
      title: '写给一年前的自己',
      description:
        '一年了。{name}坐在咖啡店里回头看这段旅程——比想象的难一百倍，但学到的东西也多一百倍。如果能给一年前的自己说一句话，会说什么？',
      choices: [
        { id: '10-3a', text: '"别怕。你以为的失败，其实都是判断力在生长。"', effects: { cognition: 6, judgment: 5, connection: 2, action: 1 }, clawReaction: '{name}合上笔记本，笑了。窗外的阳光很好。一切才刚开始。', sourceIds: [48, 55], diagnosticTags: { ending: 'reflect' } },
        { id: '10-3b', text: '"再快一点。你浪费的每一天，都是在给不确定性加杠杆。"', effects: { action: 7, judgment: 3, cognition: 3 }, clawReaction: '{name}喝完咖啡，打开电脑。下一个想法已经在脑子里成形了。', sourceIds: [3, 12, 41], diagnosticTags: { ending: 'growth' } },
        { id: '10-3c', text: '"找对的人比做对的事更重要。别一个人扛。"', effects: { connection: 7, judgment: 4, cognition: 3 }, clawReaction: '{name}拿起手机，给那个一直相信自己的人发了条消息："谢谢你。"', sourceIds: [48, 55], diagnosticTags: { ending: 'reflect' } },
      ],
    },
  ],
]

/**
 * Pick one random scenario from each slot.
 * Returns 10 scenarios with sequential ids (1-10).
 */
export function generateScenarios(): Scenario[] {
  return generateScenariosFromPool(POOL)
}

export function generateScenariosFromPool(pool: readonly (readonly Scenario[])[]): Scenario[] {
  return pool.map((slot, index) => {
    const picked = slot[Math.floor(Math.random() * slot.length)]
    return { ...picked, id: index + 1 }
  })
}

export const TOTAL_ROUNDS = 10
