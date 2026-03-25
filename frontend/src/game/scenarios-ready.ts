import type { Scenario } from '../types/game.ts'

/**
 * Ready path (想好了准备开始) question pool:
 * 10 slots x 3 questions each = 30 total.
 * Each playthrough picks one random question per slot.
 */

export const READY_POOL: readonly (readonly Scenario[])[] = [
  // ── Slot 1 ──
  [
    {
      id: 1,
      title: '周末时间',
      description: '这个周末{name}本来约了朋友聚餐，但目标用户只有这个时间有空跟{name}聊。{name}会？',
      choices: [
        { id: '1-1a', text: '跟朋友聚餐，下周再约用户', effects: { connection: 2, action: -2, judgment: -1 }, clawReaction: '{name}发了一条\'下次一定\'给那个用户。但\'下次\'往往意味着\'没有下次\'。' },
        { id: '1-1b', text: '先跟用户聊完再去赶聚餐的尾巴', effects: { action: 3, judgment: 2, connection: 1, cognition: 1 }, clawReaction: '{name}两头兼顾，虽然累了点，但拿到了用户的反馈，也没错过朋友。' },
        { id: '1-1c', text: '取消聚餐，用户访谈更重要', effects: { action: 5, judgment: 3, cognition: 2, connection: -1 }, clawReaction: '{name}给朋友发了个\'抱歉\'。这是第一次因为项目推掉社交。' },
        { id: '1-1d', text: '把朋友也拉来一起聊，看看他们有没有同样的痛点', effects: { connection: 4, judgment: 3, action: 4, cognition: 1 }, clawReaction: '{name}把聚餐变成了用户调研。朋友觉得有趣，用户觉得轻松，一举两得。' },
      ],
    },
    {
      id: 1,
      title: '娱乐时间',
      description: '过去一个月{name}在短视频和游戏上花了多少时间？如果把这些时间全部用来推进项目，{name}愿意吗？',
      choices: [
        { id: '1-2a', text: '不太愿意，需要放松', effects: { action: -2 }, clawReaction: '{name}觉得劳逸结合很重要。没错，但创业的前六个月，\'逸\'是奢侈品。' },
        { id: '1-2b', text: '可以减少一半', effects: { action: 2, judgment: 1 }, clawReaction: '{name}开始有意识地管理时间了。每天多出来的两小时，一个月就是一个MVP。' },
        { id: '1-2c', text: '全部砍掉，只做项目', effects: { action: 5, judgment: 3, cognition: 1, connection: -1 }, clawReaction: '{name}删掉了手机上的游戏和短视频APP。世界突然安静了。' },
        { id: '1-2d', text: '我已经这么做了', effects: { action: 6, judgment: 4, cognition: 2 }, clawReaction: '{name}上次刷短视频是两个月前的事了。现在刷的都是竞品和用户反馈。' },
      ],
    },
    {
      id: 1,
      title: '学一个新技能',
      description: '{name}的项目需要一个完全不会的技能——比如写代码、做设计或者做运营。{name}会？',
      choices: [
        { id: '1-3a', text: '找人帮忙，这不是我的强项', effects: { connection: 3, action: 1 }, clawReaction: '{name}发了十条消息找人帮忙。三天后，只有一个人回了\'有空再说\'。' },
        { id: '1-3b', text: '报个课程系统学习', effects: { cognition: 2, action: 3, judgment: 1 }, clawReaction: '{name}花了一周看课程。学到了很多，但还没动手做。知道和做到之间隔着一万行代码。' },
        { id: '1-3c', text: '直接上手边做边学，不会就查', effects: { action: 5, cognition: 3, judgment: 2 }, clawReaction: '{name}第一天做出来的东西惨不忍睹，但它能跑。第七天已经像模像样了。' },
        { id: '1-3d', text: '学到够用就行，80分足够，不追求完美', effects: { judgment: 4, action: 4, cognition: 2 }, clawReaction: '{name}用三天学会了别人一个月学的东西。秘诀不是聪明，而是目标明确——只学当下需要的。' },
      ],
    },
  ],

  // ── Slot 2 ──
  [
    {
      id: 2,
      title: '消费降级',
      description: '为了省钱支撑项目，{name}愿意把每月生活费砍掉多少？',
      choices: [
        { id: '2-1a', text: '不砍，生活质量不能牺牲', effects: { action: -2 }, clawReaction: '{name}觉得生活品质不能将就。但每一杯30块的咖啡，都是一次A/B测试的预算。' },
        { id: '2-1b', text: '砍20%，少点外卖和奶茶', effects: { action: 2, judgment: 1 }, clawReaction: '{name}开始自己做饭了。省下来的钱刚好够买一个月的服务器。' },
        { id: '2-1c', text: '砍50%，基本只吃食堂', effects: { action: 4, judgment: 3, cognition: 1 }, clawReaction: '{name}的午餐固定变成了食堂一荤一素。同学问为什么，{name}说\'在做一个实验\'。' },
        { id: '2-1d', text: '砍到底，只要不饿着就行', effects: { action: 5, judgment: 3, connection: -1 }, clawReaction: '{name}吃了一个月泡面和馒头。不是故意吃苦，是真的不在意——脑子里全是产品。' },
      ],
    },
    {
      id: 2,
      title: '被拒绝',
      description: '{name}找了10个陌生人聊自己的想法，8个人完全不感兴趣。{name}的反应是？',
      choices: [
        { id: '2-2a', text: '果然不行，这个方向不对', effects: { judgment: -2, action: -3 }, clawReaction: '{name}把笔记本合上了。但8个人不感兴趣，可能只是说明你找错了人，不是找错了方向。' },
        { id: '2-2b', text: '有点沮丧，但那2个感兴趣的人给了我信心', effects: { judgment: 2, action: 2, cognition: 1, connection: 1 }, clawReaction: '{name}回家仔细回忆那两个人的表情。他们是真的需要，还是在礼貌地鼓励？' },
        { id: '2-2c', text: '不看态度，看行为——那2个人的反应才有意义', effects: { judgment: 3, cognition: 4, action: 5 }, clawReaction: '{name}开始懂了：用户会撒谎，但行为不会。那两个人追问了细节，这才是真信号。' },
        { id: '2-2d', text: '继续找下一个10个人，样本还不够', effects: { action: 5, judgment: 3, cognition: 2, connection: 1 }, clawReaction: '{name}又约了10个人。这一轮有4个人感兴趣。方向对了，上一轮只是样本太小。' },
      ],
    },
    {
      id: 2,
      title: '免费劳动',
      description: '{name}的产品需要有人帮忙测试，但付不起钱。{name}会？',
      choices: [
        { id: '2-3a', text: '等有钱了再推进', effects: { action: -3, judgment: -1 }, clawReaction: '{name}打算先攒钱。但等钱到位的时候，市场窗口可能已经关了。' },
        { id: '2-3b', text: '请朋友帮忙，请他们吃饭作为回报', effects: { connection: 3, action: 2, judgment: 1 }, clawReaction: '{name}请了五个朋友吃了一顿火锅。他们边吃边测，提了20条bug。最便宜的QA团队。' },
        { id: '2-3c', text: '直接去目标用户群里找志愿者，用产品本身吸引他们', effects: { action: 4, connection: 3, judgment: 3, cognition: 1 }, clawReaction: '{name}在一个行业群里发了测试邀请。12个人报名了，其中3个说\'我就是你要解决的那类人\'。' },
        { id: '2-3d', text: '自己当测试员，加上最核心的3个用户就够了', effects: { action: 5, judgment: 4, cognition: 2 }, clawReaction: '{name}坐在3个用户旁边看他们操作。发现的问题，比100个问卷都有价值。' },
      ],
    },
  ],

  // ── Slot 3 ──
  [
    {
      id: 3,
      title: '面子问题',
      description: '做用户调研需要{name}在街头或群里向陌生人推销自己的想法。{name}会尴尬吗？',
      choices: [
        { id: '3-1a', text: '太尴尬了，做不到', effects: { action: -3, judgment: -1, connection: -1 }, clawReaction: '{name}打开了群聊输入框，写了一段话，然后全删了。发不出去。' },
        { id: '3-1b', text: '会尴尬，但硬着头皮上', effects: { action: 3, judgment: 2, connection: 1 }, clawReaction: '{name}脸红着发了出去。第一个人回复\'这是什么？\'，尴尬。第三个人回复\'我需要！\'，值了。' },
        { id: '3-1c', text: '尴尬一下就过了，拿到反馈更重要', effects: { action: 4, judgment: 4, cognition: 2, connection: 1 }, clawReaction: '{name}发现尴尬的保质期大约是30秒。而拿到的反馈，保质期是一辈子。' },
        { id: '3-1d', text: '不尴尬，我对这个问题的热情比面子重要', effects: { action: 5, judgment: 5, connection: 2, cognition: 1 }, clawReaction: '{name}跟陌生人聊得兴奋起来，忘了这是\'推销\'。热情是最好的说服力。' },
      ],
    },
    {
      id: 3,
      title: '社交媒体',
      description: '{name}需要在朋友圈或社交媒体上公开宣传自己的项目。同学、前同事、父母都会看到。{name}？',
      choices: [
        { id: '3-2a', text: '不发，太丢人了，万一失败呢', effects: { action: -3, judgment: -2 }, clawReaction: '{name}想到了失败后被围观的画面。但不发出去，永远不会有人知道你在做什么。' },
        { id: '3-2b', text: '发，但措辞小心翼翼，不说\'创业\'两个字', effects: { action: 1, connection: 1 }, clawReaction: '{name}发了一条含糊的朋友圈。点赞的人不少，但没人知道你在做什么。' },
        { id: '3-2c', text: '大方发，不怕被看见', effects: { action: 4, judgment: 3, connection: 2 }, clawReaction: '{name}发了一条清楚的朋友圈。有人点赞，有人笑话，有一个人私信说\'我也有这个问题\'。' },
        { id: '3-2d', text: '不只是发，而是主动@可能感兴趣的人', effects: { action: 5, connection: 4, judgment: 3, cognition: 1 }, clawReaction: '{name}@了12个人。6个人没反应，4个人说了鼓励的话，2个人说\'我能试试吗？\'——这两个人价值千金。' },
      ],
    },
    {
      id: 3,
      title: '时间紧迫',
      description: '{name}给自己设了14天做出第一个可用版本。到了第10天，完成度只有40%。{name}会？',
      choices: [
        { id: '3-3a', text: '延期，质量比速度重要', effects: { cognition: 2, action: -2 }, clawReaction: '{name}给自己又加了两周。但创业最致命的敌人不是粗糙，而是拖延。' },
        { id: '3-3b', text: '砍功能，只留最核心的一个', effects: { judgment: 4, action: 5, cognition: 2 }, clawReaction: '{name}把功能列表从15项砍到了3项。突然发现，其实只有1项是用户真正需要的。' },
        { id: '3-3c', text: '通宵赶工，不管质量先做出来', effects: { action: 5, judgment: 1 }, clawReaction: '{name}连续三个通宵。做出来了，但自己都不太满意。不过——做出来，永远比完美更重要。' },
        { id: '3-3d', text: '不做产品了，先用手工方式帮5个用户解决问题', effects: { judgment: 4, action: 6, cognition: 3, connection: 2 }, clawReaction: '{name}放弃了产品思维，直接用微信+手工帮用户干活。效率低，但发现了产品永远发现不了的需求。' },
      ],
    },
  ],

  // ── Slot 4 ──
  [
    {
      id: 4,
      title: '第一次展示',
      description: '第一个版本做出来了，很粗糙，bug也不少。有5个用户等着试用。{name}会？',
      choices: [
        { id: '4-1a', text: '再改改，等到自己满意了再给', effects: { cognition: 1, action: -3, judgment: -2 }, clawReaction: '{name}又改了两周。产品变好了一点，但那5个用户已经不记得你了。' },
        { id: '4-1b', text: '发之前先说明\'这是早期版本，很多地方还在改\'', effects: { action: 3, judgment: 2, connection: 2 }, clawReaction: '{name}发了一段长长的免责声明。用户说\'行了行了，快让我试试\'。' },
        { id: '4-1c', text: '直接发，看他们怎么用，而不是怎么评价', effects: { action: 5, judgment: 4, cognition: 3, connection: 1 }, clawReaction: '{name}发出去后死死盯着后台数据。发现用户用的方式和自己设计的完全不一样。这比任何评价都有价值。' },
        { id: '4-1d', text: '坐在用户旁边看他们用，比发出去更重要', effects: { judgment: 3, cognition: 4, connection: 3, action: 5 }, clawReaction: '{name}看到用户在第三步卡住了，皱着眉头。这一秒的观察，胜过一万字的产品文档。' },
      ],
    },
    {
      id: 4,
      title: '实习还是项目',
      description: '收到了一个很好的实习offer，月薪1万5。但{name}的项目正在关键期。{name}会？',
      choices: [
        { id: '4-2a', text: '去实习，钱和经验都重要', effects: { cognition: 2, connection: 1, action: -2, judgment: -1 }, clawReaction: '{name}入职了大厂。三个月后回来发现，项目的用户已经被竞品抢走了。' },
        { id: '4-2b', text: '去实习，用业余时间继续做项目', effects: { action: 3, cognition: 2, judgment: 1 }, clawReaction: '{name}白天上班晚上做项目，每天只睡5小时。两个月后，两边都做到了60分。' },
        { id: '4-2c', text: '拒掉实习，全力做项目', effects: { action: 5, judgment: 5, cognition: 1, connection: -1 }, clawReaction: '{name}放弃了确定的月薪，选择了不确定的未来。但风险不会因为等待而降低，只会因为错过而放大。' },
        { id: '4-2d', text: '跟实习公司谈：能不能远程或半职，同时做项目', effects: { judgment: 3, connection: 3, action: 5, cognition: 1 }, clawReaction: '{name}居然谈成了。对方说\'我们也想看看你那个项目\'。有时候最好的选择不是二选一。' },
      ],
    },
    {
      id: 4,
      title: '恋爱与创业',
      description: '{name}的另一半说：\'你最近陪我的时间越来越少了，能不能平衡一下？\'{name}会？',
      choices: [
        { id: '4-3a', text: '他/她说得对，减少项目时间', effects: { connection: 3, action: -2 }, clawReaction: '{name}回归了生活。但每次约会时脑子里都在想产品的事，人在心不在。' },
        { id: '4-3b', text: '尝试更高效地工作，把时间挤出来', effects: { action: 3, judgment: 3, cognition: 1, connection: 2 }, clawReaction: '{name}开始严格管理时间。每天留出2小时完全属于对方。效率反而比之前更高了。' },
        { id: '4-3c', text: '认真谈一次，让他/她理解这件事对你有多重要', effects: { judgment: 3, connection: 3, action: 3, cognition: 1 }, clawReaction: '{name}第一次认真地跟对方讲了自己在做的事。对方沉默了一会儿，说\'那我能帮什么？\'' },
        { id: '4-3d', text: '如果不理解，那可能不适合现在在一起', effects: { judgment: 5, action: 4, cognition: 1, connection: -2 }, clawReaction: '{name}做了一个很痛的选择。但创业的代价，有时候不只是钱和时间。' },
      ],
    },
  ],

  // ── Slot 5 ──
  [
    {
      id: 5,
      title: '合伙人分歧',
      description: '{name}找了一个朋友一起做。他觉得应该先做一个漂亮的APP，{name}觉得应该先用微信群手工服务。{name}会？',
      choices: [
        { id: '5-1a', text: '听他的，毕竟是合伙人，要尊重', effects: { connection: 2, judgment: -2, action: -1 }, clawReaction: '{name}让步了。三周后APP还在设计阶段，而那个本该验证的需求，依然是个假设。' },
        { id: '5-1b', text: '讨论一下，找一个折中方案', effects: { connection: 2, judgment: 2, cognition: 1, action: 2 }, clawReaction: '{name}和他聊了两小时。最后决定先用微信群跑两周，如果数据好再做APP。折中但有效。' },
        { id: '5-1c', text: '坚持自己的，先验证需求比做产品更重要', effects: { judgment: 4, action: 5, cognition: 3, connection: -1 }, clawReaction: '{name}坚持了。合伙人不太高兴，但两周后数据出来了——{name}是对的。' },
        { id: '5-1d', text: '两个人各做一个方案，用数据说话', effects: { judgment: 3, action: 5, cognition: 3, connection: 1 }, clawReaction: '两周后，微信群方案拿到了20个真实用户，APP方案还在画原型。数据说话了。' },
      ],
    },
    {
      id: 5,
      title: '没人看好你',
      description: '{name}跟5个长辈讲了想法，只有1个人说\'可以试试\'，其他4个都泼冷水。{name}的状态？',
      choices: [
        { id: '5-2a', text: '动摇了，也许真的不行', effects: { judgment: -2, action: -2, connection: 1 }, clawReaction: '{name}把写好的计划书存到了一个叫\'以后再说\'的文件夹。' },
        { id: '5-2b', text: '有点受伤，但还想继续', effects: { judgment: 1, action: 1 }, clawReaction: '{name}心里难受了一晚上。但第二天早上醒来，第一件事还是打开了那个项目文档。' },
        { id: '5-2c', text: '不在意，他们不是我的用户', effects: { judgment: 3, action: 4, cognition: 2, connection: -1 }, clawReaction: '{name}开始明白一个道理：投资人看数据，用户看价值，长辈看风险。你不能用同一把尺子量所有人。' },
        { id: '5-2d', text: '那1个人说\'可以试试\'，就够了', effects: { judgment: 5, action: 5, cognition: 2, connection: 1 }, clawReaction: '{name}仔细回忆了那个人说话时的表情——不是客气，是真的觉得有戏。一个真正理解你的人，比一百个不理解的人更重要。' },
      ],
    },
    {
      id: 5,
      title: '钱快花完了',
      description: '{name}用自己的积蓄做项目，已经花了8000块，目前还没有任何收入。还要继续投入吗？',
      choices: [
        { id: '5-3a', text: '不了，止损', effects: { judgment: 1, action: -3, cognition: 1 }, clawReaction: '{name}停了下来。止损是理性的选择，但你确定是在止损，而不是在逃避？' },
        { id: '5-3b', text: '再投最后2000，如果还是不行就停', effects: { judgment: 3, action: -1, cognition: 4 }, clawReaction: '{name}给了自己最后一次机会。这2000块的使用效率，可能是你人生中最高的一次。' },
        { id: '5-3c', text: '想办法赚钱——做兼职也行，但不停项目', effects: { action: 5, judgment: 3, cognition: 1 }, clawReaction: '{name}白天送外卖，晚上做产品。辛苦，但项目没停。创业最怕的不是苦，是断裂。' },
        { id: '5-3d', text: '去找3个用户问：你愿意为这个付钱吗？答案决定下一步', effects: { judgment: 4, action: 6, cognition: 3, connection: 2 }, clawReaction: '{name}问了三个人。两个人犹豫，一个人说\'现在就可以付\'。这一个回答，比8000块的投入更有价值。' },
      ],
    },
  ],

  // ── Slot 6 ──
  [
    {
      id: 6,
      title: '被人抄了',
      description: '{name}发现有人做了一个和自己几乎一样的产品，而且比自己做得好。{name}会？',
      choices: [
        { id: '6-1a', text: '算了，人家做得更好', effects: { judgment: -2, action: -3 }, clawReaction: '{name}关掉了竞品的网页。但放弃一个被验证的方向，才是最大的浪费。' },
        { id: '6-1b', text: '焦虑，但还是想继续', effects: { judgment: 1, action: 1 }, clawReaction: '{name}失眠了两天。焦虑正常，但焦虑不能帮你赢——行动才能。' },
        { id: '6-1c', text: '去用他们的产品，找到他们没做好的地方', effects: { judgment: 3, cognition: 4, action: 6 }, clawReaction: '{name}花了一整天体验竞品。发现了5个明显的缺陷。有竞品反而是好事——说明需求是真的。' },
        { id: '6-1d', text: '好事——说明需求是真的。我要做得更贴近用户', effects: { judgment: 4, action: 6, cognition: 3, connection: 1 }, clawReaction: '{name}的心态转变了。有人在做说明方向对了，做得更好说明市场够大。真正的壁垒是你对用户的理解深度。' },
      ],
    },
    {
      id: 6,
      title: '第一笔收入',
      description: '有一个用户愿意付300块/月使用{name}的产品。但{name}觉得产品还很粗糙，\'配不上\'收费。{name}会？',
      choices: [
        { id: '6-2a', text: '等产品更完善了再收费', effects: { cognition: 1, action: -3, judgment: -2 }, clawReaction: '{name}拒绝了这300块。三个月后产品确实更好了，但那个用户已经找到了替代品。' },
        { id: '6-2b', text: '收，但打折，100块/月', effects: { action: 2, judgment: 1, connection: 1 }, clawReaction: '{name}收了100块。用户说\'不用打折，值300\'。你对自己产品的定价，暴露了你对自己价值的判断。' },
        { id: '6-2c', text: '收300，但承诺每周更新一个他最需要的功能', effects: { action: 4, judgment: 4, connection: 3, cognition: 2 }, clawReaction: '{name}开始了\'边收费边迭代\'的模式。这300块不只是收入，是一份契约——用户用钱投票，你用行动回应。' },
        { id: '6-2d', text: '收300，而且问他愿不愿意介绍更多有同样需求的人', effects: { action: 5, judgment: 5, connection: 4, cognition: 1 }, clawReaction: '{name}拿到了第一笔收入和第一个转介绍。产品从来不是做出来才有价值，而是被用起来才有价值。' },
      ],
    },
    {
      id: 6,
      title: '身体的代价',
      description: '连续一个月每天工作14小时，{name}开始头疼、失眠、胃痛。{name}会？',
      choices: [
        { id: '6-3a', text: '立刻停下来休息，身体最重要', effects: { cognition: 0, connection: 0, action: 5 }, clawReaction: '{name}休息了一周。身体恢复了，但项目停了一周。健康是1，其他都是后面的0。' },
        { id: '6-3b', text: '减少到每天10小时，找到可持续的节奏', effects: { judgment: 3, action: 4, cognition: 2 }, clawReaction: '{name}找到了自己的可持续节奏。创业是马拉松不是百米冲刺，节奏比速度更重要。' },
        { id: '6-3c', text: '咬牙再坚持一下，快到关键节点了', effects: { action: 4, judgment: 1, cognition: -1 }, clawReaction: '{name}又撑了两周。到了节点，但身体也到了极限。这次赌对了，但不是每次都能赌对。' },
        { id: '6-3d', text: '审视自己是不是在用\'忙\'逃避更难的问题', effects: { judgment: 4, cognition: 3, action: 3 }, clawReaction: '{name}停下来想了想：这14小时里，真正有价值的可能只有6小时。其余时间是在用忙碌麻痹自己。' },
      ],
    },
  ],

  // ── Slot 7 ──
  [
    {
      id: 7,
      title: '搬到陌生城市',
      description: '如果项目需要{name}长时间牺牲舒适生活——比如搬到陌生城市、住在简陋环境里、睡公司——{name}会？',
      choices: [
        { id: '7-1a', text: '完全不能，生活质量对我很重要', effects: { action: -3, judgment: -1 }, clawReaction: '{name}需要舒适的环境才能工作。这不是弱点，但可能会限制你的选择半径。' },
        { id: '7-1b', text: '可以短期接受，但会寻找改善办法', effects: { judgment: 2, action: 3, cognition: 1 }, clawReaction: '{name}住进了一个月租800的合租房。环境很差，但两个月后换了一个好一点的——因为产品开始赚钱了。' },
        { id: '7-1c', text: '可以坚持，只要项目在进展', effects: { action: 5, judgment: 4, cognition: 2 }, clawReaction: '{name}在办公室支了一张折叠床。半夜醒来看一眼数据，然后继续睡。进展是最好的安眠药。' },
        { id: '7-1d', text: '不觉得是问题，反而觉得这种状态更专注', effects: { action: 6, judgment: 5, cognition: 2, connection: -1 }, clawReaction: '{name}发现极简的生活反而让大脑更清晰。没有干扰，只有问题和解法。这种状态，很多人花钱都买不到。' },
      ],
    },
    {
      id: 7,
      title: '社交孤立',
      description: '做项目之后{name}的社交急剧减少，朋友开始说{name}\'变了\'。{name}？',
      choices: [
        { id: '7-2a', text: '很在意，重新分配时间给社交', effects: { connection: 3, action: -2 }, clawReaction: '{name}回到了朋友圈。但聊着聊着发现，话题已经不一样了。你在想用户增长，他们在聊综艺。' },
        { id: '7-2b', text: '有些愧疚，但目前无法改变', effects: { judgment: 2, action: 2 }, clawReaction: '{name}给几个好朋友发了消息解释。真正的朋友说\'去忙吧，忙完找我\'。' },
        { id: '7-2c', text: '真正理解我的人不会这么说', effects: { judgment: 3, action: 5, cognition: 1, connection: -1 }, clawReaction: '{name}不再解释了。创业会重新筛选你的社交圈——留下来的才是真的。' },
        { id: '7-2d', text: '我的社交圈正在换——和做事的人在一起更有意义', effects: { judgment: 4, connection: 3, action: 4, cognition: 2 }, clawReaction: '{name}开始参加创业者聚会。发现和做事的人在一起，每一次对话都有密度。' },
      ],
    },
    {
      id: 7,
      title: '全部押上',
      description: '如果需要把所有积蓄——比如5万块——全部投入项目才能继续，{name}会？',
      choices: [
        { id: '7-3a', text: '不行，这是我的底线', effects: { judgment: 1, action: -3 }, clawReaction: '{name}守住了底线。安全的，但也安全地错过了。' },
        { id: '7-3b', text: '投一半，留一半保底', effects: { judgment: 2, action: 3, cognition: 1 }, clawReaction: '{name}投了2万5。这个选择本身就说明了一件事——你信，但不是全信。' },
        { id: '7-3c', text: '全投，但要先确认最关键的假设', effects: { judgment: 4, action: 5, cognition: 3 }, clawReaction: '{name}在投钱之前做了一件事：找10个用户问了一个问题。答案让{name}确信这钱值得投。' },
        { id: '7-3d', text: '已经投了', effects: { action: 6, judgment: 5, cognition: 1 }, clawReaction: '{name}的银行余额只剩三位数了。但服务器在跑，用户在增长。这是最穷也最富有的时刻。' },
      ],
    },
  ],

  // ── Slot 8 ──
  [
    {
      id: 8,
      title: '退学的念头',
      description: '项目发展到了关键期，继续读书意味着只能兼顾。有人建议{name}退学。{name}会？',
      choices: [
        { id: '8-1a', text: '绝对不退，学历是保底', effects: { action: -2, cognition: 1, connection: 1 }, clawReaction: '{name}选择了安全网。但世界上很多最伟大的公司，都是辍学生创办的。' },
        { id: '8-1b', text: '休学一年，给自己一个时间窗', effects: { judgment: 3, action: 4, cognition: 2 }, clawReaction: '{name}找了辅导员谈休学。一年的窗口期，足够验证一个方向。' },
        { id: '8-1c', text: '退学，把所有时间投入项目', effects: { action: 6, judgment: 3, connection: -1 }, clawReaction: '{name}退学了。家人很担心，但{name}从没这么清醒过。' },
        { id: '8-1d', text: '取决于项目数据——如果用户在增长就退，还在验证期就不退', effects: { judgment: 6, action: -1, cognition: 7 }, clawReaction: '{name}不冲动也不怯懦。让数据做决策，这是最成熟的创业者思维。' },
      ],
    },
    {
      id: 8,
      title: '连续失败',
      description: '{name}已经连续尝试了3个方向，全部失败了。身边的人开始用同情的眼光看{name}。{name}的真实状态是？',
      choices: [
        { id: '8-2a', text: '开始怀疑自己是不是不适合做这件事', effects: { judgment: -2, action: -2, cognition: 1 }, clawReaction: '{name}开始动摇了。但三次失败的经验，已经让你比99%没试过的人更接近成功。' },
        { id: '8-2b', text: '很痛苦，但不想放弃', effects: { judgment: 2, action: 2, cognition: 1 }, clawReaction: '{name}擦了擦眼泪继续干。痛苦不是弱点，它是你还在乎的证明。' },
        { id: '8-2c', text: '每次失败都让我离正确答案更近了', effects: { judgment: 3, cognition: 4, action: 6 }, clawReaction: '{name}列了一张表：三次失败分别教会了我什么。发现这张表比任何MBA课程都有价值。' },
        { id: '8-2d', text: '第4次会成的——我已经排除了3个错误答案', effects: { judgment: 4, action: 5, cognition: 3 }, clawReaction: '{name}像科学家一样思考：每次失败都是一个被排除的假设。真相越来越近了。' },
      ],
    },
    {
      id: 8,
      title: '向别人借钱',
      description: '项目需要钱续命。{name}的选择是？',
      choices: [
        { id: '8-3a', text: '不借钱，有多少做多少', effects: { judgment: 0, action: 4, cognition: 0 }, clawReaction: '{name}选择了零杠杆。安全，但也意味着速度受限。' },
        { id: '8-3b', text: '找家人借，他们最安全', effects: { connection: 2, action: 2 }, clawReaction: '{name}开口了。家人虽然不理解，但还是支持了。不过这笔钱的重量，比银行贷款更重。' },
        { id: '8-3c', text: '找相信你的人投资，给他们股份', effects: { judgment: 3, connection: 4, action: 4, cognition: 1 }, clawReaction: '{name}写了一页纸的商业计划，找了3个相信自己的人。一个人投了5万，说\'我投的是你这个人\'。' },
        { id: '8-3d', text: '先想办法让项目自己赚钱，哪怕很少', effects: { judgment: 4, action: 6, cognition: 3 }, clawReaction: '{name}绞尽脑汁让产品产生了第一笔收入——虽然只有500块/月，但它证明了模式能跑通。' },
      ],
    },
  ],

  // ── Slot 9 ──
  [
    {
      id: 9,
      title: '道德灰区',
      description: '{name}发现一个快速获客的方法，法律上没问题但道德上有点擦边。所有竞对都在这么做。{name}会？',
      choices: [
        { id: '9-1a', text: '不做，原则比增长重要', effects: { judgment: 4, cognition: 2, action: -1, connection: 1 }, clawReaction: '{name}拒绝了捷径。增长慢了，但晚上睡得着。长期来看，品牌就是你做过的每一个选择。' },
        { id: '9-1b', text: '做一次试试效果，如果不舒服就停', effects: { action: 4 }, clawReaction: '{name}试了一次。效果确实好，但心里一直不舒服。有些线一旦越过，就很难回来。' },
        { id: '9-1c', text: '做，但给自己设一条底线', effects: { action: 3, judgment: 2, cognition: 1 }, clawReaction: '{name}在灰色地带找了一个平衡点。但底线这种东西，一旦开始后退，就会越退越远。' },
        { id: '9-1d', text: '不做——但找到一个比它更好的正路方法', effects: { judgment: 3, action: 6, cognition: 4, connection: 1 }, clawReaction: '{name}花了三倍时间找到了一个干净的增长方式。效果更慢，但可持续。真正的壁垒不是速度，是信任。' },
      ],
    },
    {
      id: 9,
      title: '健康警报',
      description: '医生说{name}的身体出了问题，必须休息至少一个月。但项目下个月有一个关键节点。{name}会？',
      choices: [
        { id: '9-2a', text: '听医生的，身体永远第一', effects: { cognition: 2, connection: 1, action: -2, judgment: 1 }, clawReaction: '{name}停下来了。一个月后身体恢复了，项目的关键节点错过了。但{name}还活着。' },
        { id: '9-2b', text: '休息两周，边养病边远程处理最关键的事', effects: { judgment: 2, action: 3, cognition: 1 }, clawReaction: '{name}学会了区分\'重要\'和\'紧急\'。躺在床上也能做判断和决策，不能做的只是执行。' },
        { id: '9-2c', text: '找人暂时接手日常工作，自己只处理决策', effects: { judgment: 4, connection: 3, action: 4, cognition: 2 }, clawReaction: '{name}第一次真正授权。发现团队其实可以自己跑，只是之前你不敢放手。' },
        { id: '9-2d', text: '带病坚持', effects: { action: 5, judgment: -1, cognition: -2, connection: -1 }, clawReaction: '{name}撑过了那个月。但身体的账单最终还是要还的——只是不知道什么时候。' },
      ],
    },
    {
      id: 9,
      title: '团队叛离',
      description: '{name}的合伙人带着核心代码和两个工程师离开了，去做了一个竞品。{name}会？',
      choices: [
        { id: '9-3a', text: '崩溃，觉得被背叛了', effects: { judgment: -2, action: -3, connection: -2 }, clawReaction: '{name}一个人坐在空荡荡的办公室里。信任碎了一地。' },
        { id: '9-3b', text: '难过，但马上开始重建', effects: { action: 4, judgment: 3, cognition: 1 }, clawReaction: '{name}哭了一晚上，第二天早上开始写招聘帖。眼泪还没干，手已经在键盘上了。' },
        { id: '9-3c', text: '冷静分析：留下的人能不能继续？最核心的资产是什么？', effects: { judgment: 4, cognition: 4, action: 6 }, clawReaction: '{name}列了一张清单。代码可以重写，用户关系在自己手里。最核心的资产从来不是代码，是你对用户的理解。' },
        { id: '9-3d', text: '这反而证明了方向是对的——开始找更好的人', effects: { judgment: 5, action: 5, connection: 2, cognition: 2 }, clawReaction: '{name}转念一想：如果方向不好，他为什么要抄？有人抄你，说明你走在前面。' },
      ],
    },
  ],

  // ── Slot 10 ──
  [
    {
      id: 10,
      title: '家人的反对',
      description: '父母说：\'你再这样下去我们不支持你了，别回家了。\'{name}会？',
      choices: [
        { id: '10-1a', text: '妥协，不值得为创业和家人闹翻', effects: { connection: 3, judgment: -1, action: -3 }, clawReaction: '{name}回家了。父母松了口气，但{name}的眼神里少了什么东西。' },
        { id: '10-1b', text: '跟他们深谈一次，把真实数据和进展讲清楚', effects: { judgment: 2, connection: 4, action: 5, cognition: 2 }, clawReaction: '{name}准备了一份\'给爸妈看的PPT\'。用数据和逻辑，像对投资人一样认真。父母没完全理解，但态度软了。' },
        { id: '10-1c', text: '心里很痛，但不会因此停下', effects: { judgment: 5, action: 5, cognition: 1, connection: -2 }, clawReaction: '{name}给妈妈发了一条长消息，然后关了手机。有些路只能一个人走。' },
        { id: '10-1d', text: '他们会理解的——等我做出结果', effects: { judgment: 4, action: 4, cognition: 1 }, clawReaction: '{name}不再争辩了。所有的解释都不如结果有力。六个月后，{name}带着第一份收入数据回了家。' },
      ],
    },
    {
      id: 10,
      title: '最后3个月',
      description: '{name}只剩最后3万块钱和最后3个月。过了这个节点，{name}要么做出来要么回去找工作。{name}怎么用这3个月？',
      choices: [
        { id: '10-2a', text: '找工作吧，不能再冒险了', effects: { judgment: 1, action: -3, connection: 1 }, clawReaction: '{name}打开了招聘网站。但写简历的时候，脑子里还是那个项目。' },
        { id: '10-2b', text: '把3万块和3个月全部投入那一个最关键的假设', effects: { judgment: 4, action: 6, cognition: 3 }, clawReaction: '{name}把所有资源聚焦到一个点上。三个月后，答案是明确的——不管是\'成了\'还是\'不成\'，至少知道了。' },
        { id: '10-2c', text: '1个月赚钱续命，2个月冲刺项目', effects: { judgment: 4, action: 4, cognition: 2 }, clawReaction: '{name}找了一份兼职，把生存问题解决了。然后用最后两个月全力以赴。活着才能继续战斗。' },
        { id: '10-2d', text: '去找10个用户说实话：你们愿不愿意现在就付钱？他们的回答决定一切', effects: { judgment: 5, action: 6, connection: 4, cognition: 3 }, clawReaction: '{name}没有猜测，没有假设，直接问了最残酷的问题。4个人说\'愿意\'。这4个人，就是{name}继续下去的全部理由。' },
      ],
    },
    {
      id: 10,
      title: '终极问题',
      description: '做了这么多准备，经历了这么多考验——如果现在有人问{name}：\'你为什么非要做这件事？\'{name}的回答是？',
      choices: [
        { id: '10-3a', text: '因为不想打工', effects: { action: 1 }, clawReaction: '{name}的出发点是逃避。逃避可以让你开始，但不能让你坚持。' },
        { id: '10-3b', text: '因为我看到了一个机会', effects: { judgment: 2, action: 3, cognition: 2 }, clawReaction: '{name}看到了别人没看到的东西。能看到机会是天赋，抓住机会是选择。' },
        { id: '10-3c', text: '因为有一群人真的需要它，而我能做出来', effects: { judgment: 4, action: 5, cognition: 3, connection: 3 }, clawReaction: '{name}的回答不是关于自己，而是关于用户。这才是创业最坚实的理由——有人需要，你能做。' },
        { id: '10-3d', text: '因为如果我不做，我会后悔一辈子', effects: { judgment: 5, action: 5, cognition: 2 }, clawReaction: '{name}的声音很平静。不是激情，不是冲动，是深思熟虑之后的确信。这种确信，比任何商业计划都有力量。' },
      ],
    },
  ],
]
