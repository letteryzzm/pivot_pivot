import type { Scenario } from '../types/game.ts'

/**
 * Exploring path (还没想好创不创业) question pool:
 * 10 slots x 3 questions each = 30 total.
 * Each playthrough picks one random question per slot.
 */

export const EXPLORING_POOL: readonly (readonly Scenario[])[] = [
  // ── Slot 1 ──
  [
    {
      id: 1,
      title: '周末的选择',
      description: '{name}终于有一个完整的周末，没有任何安排。{name}会？',
      choices: [
        { id: '1-1a', text: '补觉、刷剧、好好休息一下', effects: { judgment: -1, action: -2, cognition: 1 }, clawReaction: '{name}睡到中午，刷完了一整部剧。很舒服，但也有点空虚。' },
        { id: '1-1b', text: '去一个没去过的地方逛逛，哪怕只是隔壁区', effects: { cognition: 3, action: 2, judgment: 1, connection: 1 }, clawReaction: '{name}在一条从没走过的街上发现了一家很酷的小店，和老板聊了半小时。' },
        { id: '1-1c', text: '找几个有意思的人约出来聊天', effects: { connection: 4, cognition: 2, judgment: 1, action: 1 }, clawReaction: '{name}约了三个不同领域的朋友，一顿饭聊出了好几个新想法。' },
        { id: '1-1d', text: '打开电脑研究一个最近感兴趣的方向', effects: { cognition: 4, action: 3, judgment: 1 }, clawReaction: '{name}一抬头已经凌晨两点了，浏览器开了47个标签页。' },
      ],
    },
    {
      id: 1,
      title: '信息源',
      description: '{name}平时主要通过什么方式了解世界？',
      choices: [
        { id: '1-2a', text: '刷短视频和朋友圈，看大家在看什么', effects: { connection: 1, cognition: -1, judgment: -1 }, clawReaction: '{name}刷了两个小时，记住了三个段子，忘了自己本来要查什么。' },
        { id: '1-2b', text: '看公众号、播客，跟着几个喜欢的博主', effects: { cognition: 2, judgment: 1, connection: 1 }, clawReaction: '{name}每天固定听两个播客，感觉自己在进步，但说不清学到了什么。' },
        { id: '1-2c', text: '直接找做事情的人聊，听第一手经验', effects: { connection: 4, judgment: 3, cognition: 2, action: 1 }, clawReaction: '{name}上周跟一个创业的学长聊了两小时，比看十篇文章收获都大。' },
        { id: '1-2d', text: '去翻原始数据、论文、产品官网，自己判断', effects: { cognition: 4, judgment: 4, action: 1 }, clawReaction: '{name}养成了一个习惯：看到任何观点，先找数据源。' },
      ],
    },
    {
      id: 1,
      title: '饭桌上的角色',
      description: '一群朋友吃饭，讨论一个热门话题，{name}通常是？',
      choices: [
        { id: '1-3a', text: '听大家说，不太发表意见', effects: { cognition: 1, judgment: -1, action: -1, connection: 1 }, clawReaction: '{name}全程微笑点头，回家路上才想到自己其实有很多想说的。' },
        { id: '1-3b', text: '附和主流观点，维持氛围', effects: { connection: 2, judgment: -2 }, clawReaction: '{name}说了几句\'对对对\'，饭局很愉快，但回去有点不舒服。' },
        { id: '1-3c', text: '提出一个不同角度，哪怕会冷场', effects: { judgment: 4, cognition: 2, connection: -1, action: 1 }, clawReaction: '桌上安静了三秒。然后有人说\'你说的有道理\'，讨论变得真正有意思起来。' },
        { id: '1-3d', text: '不争论，但回家会自己查资料验证', effects: { cognition: 3, judgment: 3, action: 1 }, clawReaction: '{name}当晚查了两小时资料，发现饭桌上大家说的有一半是错的。' },
      ],
    },
  ],

  // ── Slot 2 ──
  [
    {
      id: 2,
      title: '遇到不懂的事',
      description: '有人提到一个{name}完全不了解的领域，{name}的第一反应是？',
      choices: [
        { id: '2-1a', text: '跟我没关系', effects: { judgment: -1, action: -1, cognition: -1 }, clawReaction: '{name}礼貌地笑了笑，话题就这么过去了。' },
        { id: '2-1b', text: '有意思，回头查查', effects: { cognition: 2, judgment: 1 }, clawReaction: '{name}在手机备忘录里加了一行字，排在了之前那20条后面。' },
        { id: '2-1c', text: '你能多讲讲吗？', effects: { connection: 3, cognition: 3, judgment: 1 }, clawReaction: '对方讲了十分钟，{name}发现这个领域和自己关心的问题居然有交集。' },
        { id: '2-1d', text: '这个和我在想的那个事情是不是有关联？', effects: { judgment: 4, cognition: 4, connection: 1, action: 1 }, clawReaction: '{name}在脑子里建立了一个新的连接。这种时刻，比考满分还让人兴奋。' },
      ],
    },
    {
      id: 2,
      title: '学习的驱动力',
      description: '回想一下，{name}学东西最投入的时候，通常是因为？',
      choices: [
        { id: '2-2a', text: '要考试了，不得不学', effects: { action: 1, judgment: -1 }, clawReaction: '{name}每次都是考前一周突击，考完就全忘了。' },
        { id: '2-2b', text: '课程本身设计得好，老师讲得有趣', effects: { cognition: 2 }, clawReaction: '{name}遇到好老师的时候像海绵一样吸收，但这样的老师太少了。' },
        { id: '2-2c', text: '自己对这个方向产生了好奇，停不下来', effects: { cognition: 4, judgment: 2, action: 3 }, clawReaction: '{name}上次为了搞懂一个问题连饭都忘了吃，这种状态才是真正的学习。' },
        { id: '2-2d', text: '因为要解决一个真实问题，必须学会', effects: { action: 4, judgment: 3, cognition: 3, connection: 1 }, clawReaction: '{name}发现当学习有了具体目标，效率是平时的十倍。' },
      ],
    },
    {
      id: 2,
      title: '一笔意外的钱',
      description: '突然有人给了{name}一万块钱，唯一的条件是不能存起来。{name}会？',
      choices: [
        { id: '2-3a', text: '买一个一直想要的东西犒劳自己', effects: { action: 1 }, clawReaction: '{name}拆快递的瞬间很开心，一周后就习惯了。' },
        { id: '2-3b', text: '去旅行，看看不同的世界', effects: { cognition: 3, connection: 1, judgment: 1, action: 1 }, clawReaction: '{name}在另一个城市走了三天，发现那里的人用完全不同的方式解决同样的问题。' },
        { id: '2-3c', text: '请几个厉害的人吃饭，听他们聊', effects: { connection: 4, cognition: 2, judgment: 2 }, clawReaction: '{name}花了三千块请了五个人吃饭，拿到的信息价值三十万。' },
        { id: '2-3d', text: '拿去做一个小实验，验证一个想法', effects: { action: 5, judgment: 3, cognition: 2 }, clawReaction: '{name}买了域名、服务器和一些工具。一万块不多，但够点燃一个实验。' },
      ],
    },
  ],

  // ── Slot 3 ──
  [
    {
      id: 3,
      title: '别人的评价',
      description: '有人在背后说{name}"想法太多，不现实"。{name}的感受是？',
      choices: [
        { id: '3-1a', text: '有点难过，是不是该收敛一点', effects: { judgment: -2, action: -1, connection: 1 }, clawReaction: '{name}那天晚上翻来覆去睡不着，开始怀疑自己是不是太天真。' },
        { id: '3-1b', text: '无所谓，他又不了解我', effects: { judgment: 2, connection: -1 }, clawReaction: '{name}耸了耸肩。评价你的人，往往是那些什么都不做的人。' },
        { id: '3-1c', text: '反而更来劲了——那就做给你看', effects: { action: 4, judgment: 3, connection: -1 }, clawReaction: '{name}把这句话截图保存了。将来成功了要发给他看。' },
        { id: '3-1d', text: '认真想想他说的有没有道理，但不会因此放弃', effects: { judgment: 4, cognition: 3, action: 1, connection: 1 }, clawReaction: '{name}复盘了一下，确实有些想法不靠谱。但不靠谱和不现实是两码事。' },
      ],
    },
    {
      id: 3,
      title: '失败的记忆',
      description: '回想上一次{name}在某件事上失败了，{name}的处理方式是？',
      choices: [
        { id: '3-2a', text: '尽快忘掉，不去想它', effects: { judgment: -2, cognition: -1 }, clawReaction: '{name}把那段记忆压到了最深处。但偶尔半夜会突然想起来。' },
        { id: '3-2b', text: '难过了一段时间，然后接受了', effects: { cognition: 1 }, clawReaction: '{name}花了两周走出来。时间治愈了伤口，但没留下教训。' },
        { id: '3-2c', text: '仔细复盘了哪里出了问题', effects: { cognition: 4, judgment: 3, action: 1 }, clawReaction: '{name}写了一页复盘笔记。失败不可怕，不复盘才可怕。' },
        { id: '3-2d', text: '复盘之后立刻做了一个新的尝试', effects: { action: 4, judgment: 3, cognition: 3 }, clawReaction: '{name}发现失败后最好的解药不是休息，而是立刻重新出发。' },
      ],
    },
    {
      id: 3,
      title: '规则与秩序',
      description: '面对一个{name}觉得不合理的规定，{name}通常会？',
      choices: [
        { id: '3-3a', text: '遵守，没必要惹麻烦', effects: { judgment: -2, action: -2, connection: 1 }, clawReaction: '{name}按规定做了。心里不舒服，但至少安全。' },
        { id: '3-3b', text: '嘴上抱怨，但还是照做', effects: { judgment: -1, action: -1, connection: 1 }, clawReaction: '{name}在群里吐槽了一通，大家纷纷点赞，然后所有人照做。' },
        { id: '3-3c', text: '想办法绕过它，找到合规的替代方案', effects: { judgment: 4, action: 3, cognition: 2 }, clawReaction: '{name}找到了一个既不违反规定又能达到目的的方法。创业者的基因就是不接受\'不行\'。' },
        { id: '3-3d', text: '直接找制定规则的人，提出修改建议', effects: { action: 4, judgment: 3, connection: 3, cognition: 1 }, clawReaction: '对方愣了一下——从来没有人来找他讨论过这个规定。' },
      ],
    },
  ],

  // ── Slot 4 ──
  [
    {
      id: 4,
      title: '身边的榜样',
      description: '{name}最欣赏的人通常是哪种类型？',
      choices: [
        { id: '4-1a', text: '有稳定好工作、生活有序的人', effects: { connection: 1, action: -1, cognition: 1 }, clawReaction: '{name}觉得稳定本身就是一种能力，但心里隐隐觉得少了点什么。' },
        { id: '4-1b', text: '学术做得很好、认知很深的人', effects: { cognition: 3, judgment: 2 }, clawReaction: '{name}佩服那种能把一个问题想到极致的人，但也好奇——想明白和做出来，哪个更难？' },
        { id: '4-1c', text: '白手起家、从零做出成绩的人', effects: { action: 3, judgment: 3, cognition: 1 }, clawReaction: '{name}每次听到这样的故事都热血沸腾，但也会问自己：我能吗？' },
        { id: '4-1d', text: '看到问题就忍不住去解决、想改变世界的人', effects: { judgment: 4, action: 4, cognition: 2, connection: 1 }, clawReaction: '{name}最近开始觉得，\'改变世界\'也许不是口号，而是一种生活方式。' },
      ],
    },
    {
      id: 4,
      title: '十年后',
      description: '闭上眼想象十年后的自己，{name}脑海里第一个画面是什么？',
      choices: [
        { id: '4-2a', text: '一个舒适的家，稳定的收入，家人在身边', effects: { connection: 2, action: -1 }, clawReaction: '{name}看到了一个温暖的画面。安全、可预期、舒适。但总觉得画面有点模糊。' },
        { id: '4-2b', text: '在某个领域成为专家，受人尊敬', effects: { cognition: 3, judgment: 1, connection: 1 }, clawReaction: '{name}想象自己站在讲台上，讲着自己最擅长的领域。但讲台下面是谁？' },
        { id: '4-2c', text: '在做一件自己发起的事，有一群人跟着你', effects: { judgment: 3, action: 3, connection: 2, cognition: 1 }, clawReaction: '{name}看到了一间办公室，墙上贴满了便签和数据。那种画面让心跳加速。' },
        { id: '4-2d', text: '说不清，但一定不是现在这样——要有自己的路', effects: { judgment: 4, action: 2, cognition: 2 }, clawReaction: '{name}唯一确定的是：不想过一个可以被预测的人生。' },
      ],
    },
    {
      id: 4,
      title: '最渴望的东西',
      description: '{name}，你现在最渴望的是什么？',
      choices: [
        { id: '4-3a', text: '稳定和安全的生活', effects: { action: -2 }, clawReaction: '{name}想要一个不用担心明天的状态。这是最真实的需求，也是最容易被满足的。' },
        { id: '4-3b', text: '别人的认可和赞美', effects: { connection: 2, judgment: -1 }, clawReaction: '{name}希望自己的努力被看见。但如果没人看见，还会继续努力吗？' },
        { id: '4-3c', text: '掌握自己未来的方向', effects: { judgment: 4, cognition: 2, action: 2 }, clawReaction: '{name}厌倦了被安排。不管方向对不对，至少要是自己选的。' },
        { id: '4-3d', text: '推动一些真实的改变', effects: { action: 4, judgment: 3, cognition: 2, connection: 1 }, clawReaction: '{name}不只是想看到世界变好，而是想亲手推一把。' },
      ],
    },
  ],

  // ── Slot 5 ──
  [
    {
      id: 5,
      title: '无聊的恐惧',
      description: '什么情况会让{name}感到最不舒服？',
      choices: [
        { id: '5-1a', text: '经济不稳定、前途不确定', effects: { action: -1 }, clawReaction: '{name}最怕的是失控的感觉。但创业本身就是在不确定中前行。' },
        { id: '5-1b', text: '被人否定、不被理解', effects: { connection: 1, judgment: -1 }, clawReaction: '{name}需要被理解。但真正走在前面的人，往往最先被误解。' },
        { id: '5-1c', text: '每天重复一样的事，没有成长', effects: { cognition: 3, judgment: 2, action: 2 }, clawReaction: '{name}一想到十年后还在做同样的事，就有一种窒息感。' },
        { id: '5-1d', text: '明明看到了问题却什么都做不了', effects: { judgment: 4, action: 4, cognition: 2 }, clawReaction: '{name}最痛苦的不是失败，而是旁观。' },
      ],
    },
    {
      id: 5,
      title: '朋友的创业',
      description: '{name}最好的朋友辍学创业了，现在过得很苦但眼里有光。{name}的真实想法是？',
      choices: [
        { id: '5-2a', text: '替他担心，觉得太冒险了', effects: { connection: 2, action: -1, cognition: 1 }, clawReaction: '{name}每次见到他都想劝一句\'要不先回来\'，但每次看到他的状态又说不出口。' },
        { id: '5-2b', text: '佩服他的勇气，但觉得自己做不到', effects: { judgment: 1, cognition: 1, action: -1, connection: 1 }, clawReaction: '{name}在他面前感到了一种说不清的距离——不是能力的差距，而是选择的差距。' },
        { id: '5-2c', text: '有点羡慕，开始认真想自己是不是也可以', effects: { judgment: 3, cognition: 2, action: 2 }, clawReaction: '{name}那天晚上失眠了。不是焦虑，而是心里有什么东西被点燃了。' },
        { id: '5-2d', text: '直接问他：需不需要帮手？', effects: { action: 5, connection: 3, judgment: 2 }, clawReaction: '{name}发了一条消息。对方秒回：\'你认真的？明天来聊。\'' },
      ],
    },
    {
      id: 5,
      title: '如果可以重来',
      description: '如果可以重新选一次大学专业，{name}会怎么选？',
      choices: [
        { id: '5-3a', text: '选就业前景最好的', effects: { action: 1 }, clawReaction: '{name}选择了最安全的路。安全的路不一定是错的路，但一定是最挤的路。' },
        { id: '5-3b', text: '选自己最感兴趣的，管它好不好找工作', effects: { judgment: 3, cognition: 2, action: 1 }, clawReaction: '{name}选了那个让自己眼睛发亮的方向。事实上，热情本身就是最大的竞争力。' },
        { id: '5-3c', text: '不选专业，直接去做项目，边做边学', effects: { action: 4, judgment: 3, cognition: 2 }, clawReaction: '{name}觉得教室里学不到的东西太多了。真正的课堂在现实世界里。' },
        { id: '5-3d', text: '选一个能接触最多不同领域的方向', effects: { cognition: 4, connection: 2, judgment: 2 }, clawReaction: '{name}想要的不是深度，而是视野。交叉地带才是创新发生的地方。' },
      ],
    },
  ],

  // ── Slot 6 ──
  [
    {
      id: 6,
      title: '金钱观',
      description: '对{name}来说，钱意味着什么？',
      choices: [
        { id: '6-1a', text: '安全感，有了才能安心', effects: { action: -1 }, clawReaction: '{name}把钱等同于安全。这不是错，但可能会让你为了安全放弃更大的可能。' },
        { id: '6-1b', text: '自由，不用看别人脸色', effects: { judgment: 3, action: 1, cognition: 1 }, clawReaction: '{name}追求的不是富有，而是不被束缚。' },
        { id: '6-1c', text: '工具，用来做更大的事', effects: { judgment: 4, action: 3, cognition: 2 }, clawReaction: '{name}开始把钱当作杠杆而不是目的。这是创业者思维的起点。' },
        { id: '6-1d', text: '结果，做对了事情自然会来', effects: { judgment: 4, cognition: 3, action: 2, connection: 1 }, clawReaction: '{name}不追钱，追价值。钱是价值的影子。' },
      ],
    },
    {
      id: 6,
      title: '如果没人看着',
      description: '假设未来一年{name}做的事情不会被任何人知道——没有朋友圈、没有简历。{name}还会做什么？',
      choices: [
        { id: '6-2a', text: '老实说，可能会躺平', effects: { action: -3, judgment: -1 }, clawReaction: '{name}发现自己的很多努力是表演给别人看的。这个发现让人有点难受。' },
        { id: '6-2b', text: '还是会学习，但节奏会慢很多', effects: { cognition: 2, judgment: 1 }, clawReaction: '{name}承认自己需要外部反馈来维持动力。这不丢人，但也意味着你还没找到内在驱动。' },
        { id: '6-2c', text: '会做完全一样的事，我不是做给别人看的', effects: { judgment: 5, action: 3, cognition: 2 }, clawReaction: '{name}的驱动力来自内心。这种人不需要观众也能上场。' },
        { id: '6-2d', text: '反而会做一些更大胆的尝试', effects: { action: 5, judgment: 4, cognition: 2, connection: -1 }, clawReaction: '{name}发现没有观众的时候反而更自由。也许最好的创业，就是从不在意别人怎么看开始。' },
      ],
    },
    {
      id: 6,
      title: '平凡的一生',
      description: '如果{name}这辈子最终只是一个"普通人"——普通工作、普通收入、普通生活，{name}能接受吗？',
      choices: [
        { id: '6-3a', text: '可以接受，平凡不是坏事', effects: { connection: 2, action: -1 }, clawReaction: '{name}选择了平静。但"接受"和"甘心"之间，也许隔着一个深夜辗转反侧的距离。' },
        { id: '6-3b', text: '能接受，但会有点遗憾', effects: { judgment: 1, cognition: 1 }, clawReaction: '{name}心里有一个声音在说\'也许可以\'。遗憾本身，就是信号。' },
        { id: '6-3c', text: '很难接受，总觉得自己可以做更多', effects: { judgment: 3, action: 3, cognition: 2 }, clawReaction: '{name}不是不满现状，而是不甘平庸。这种不甘心，是所有伟大故事的起点。' },
        { id: '6-3d', text: '完全不能接受——哪怕失败也要试过', effects: { action: 5, judgment: 4, cognition: 1, connection: -1 }, clawReaction: '{name}宁愿轰轰烈烈地输，也不愿平平淡淡地过。这是一种危险的特质，也是一种珍贵的特质。' },
      ],
    },
  ],

  // ── Slot 7 ──
  [
    {
      id: 7,
      title: '父母的期望',
      description: '父母希望{name}走一条稳定的路，但{name}内心隐隐有另一个方向。{name}会？',
      choices: [
        { id: '7-1a', text: '听父母的，他们的经验比我多', effects: { judgment: -2, action: -2, connection: 2 }, clawReaction: '{name}选择了让父母安心。但\'让别人安心\'和\'让自己安心\'，经常是矛盾的。' },
        { id: '7-1b', text: '先走父母的路，等有能力了再说', effects: { cognition: 1, connection: 1, action: -1 }, clawReaction: '{name}打算先积累再出发。但那个\'等有能力了\'的时刻，可能永远不会来。' },
        { id: '7-1c', text: '跟他们认真谈一次，说服他们', effects: { judgment: 3, connection: 3, action: 2, cognition: 1 }, clawReaction: '{name}准备了一个小时的\'presentation\'给爸妈看。他们没被说服，但眼神里多了一些复杂的东西。' },
        { id: '7-1d', text: '尊重但不妥协，用结果证明自己', effects: { judgment: 5, action: 4, cognition: 1 }, clawReaction: '{name}不再争辩了。能说服父母的只有结果，不是道理。' },
      ],
    },
    {
      id: 7,
      title: '孤独的代价',
      description: '如果追求{name}真正想做的事意味着很长一段时间没有人理解你，{name}能接受吗？',
      choices: [
        { id: '7-2a', text: '不能，我需要被理解和支持', effects: { connection: 2, judgment: -1, action: -2 }, clawReaction: '{name}需要同行者。这不是弱点，但可能会让你只走别人走过的路。' },
        { id: '7-2b', text: '可以忍受一段时间，但不能太久', effects: { judgment: 1, action: 1, cognition: 1 }, clawReaction: '{name}给自己设了一个期限。但真正有价值的事，往往不会按你的时间表兑现。' },
        { id: '7-2c', text: '可以，只要我自己知道方向是对的', effects: { judgment: 4, action: 3, cognition: 2, connection: -1 }, clawReaction: '{name}准备好了独行。在没有掌声的路上，你只能相信自己的判断。' },
        { id: '7-2d', text: '我现在就是这种状态', effects: { judgment: 5, action: 4, cognition: 3, connection: -1 }, clawReaction: '{name}已经习惯了不被理解。真正有结构外生长力的人，往往都在最孤独的时刻成长最快。' },
      ],
    },
    {
      id: 7,
      title: '最大的恐惧',
      description: '认真想一下，{name}最害怕的事情是什么？',
      choices: [
        { id: '7-3a', text: '贫穷，没有物质保障', effects: {}, clawReaction: '{name}最怕物质匮乏。但历史上很多伟大的事情，都是从穷开始的。' },
        { id: '7-3b', text: '失败后被人嘲笑', effects: { connection: 1, judgment: -1, action: -1 }, clawReaction: '{name}怕的不是失败本身，而是失败的观众。但那些嘲笑你的人，十年后还会在你身边吗？' },
        { id: '7-3c', text: '浑浑噩噩过完一辈子，什么都没留下', effects: { judgment: 4, action: 3, cognition: 3 }, clawReaction: '{name}最恐惧的是虚度。这种恐惧本身，就是一种驱动力。' },
        { id: '7-3d', text: '明明有能力改变一些事，却因为胆怯而没有做', effects: { judgment: 5, action: 5, cognition: 2 }, clawReaction: '{name}怕的是自己不够勇敢。好消息是——能意识到这一点的人，通常比自己以为的勇敢。' },
      ],
    },
  ],

  // ── Slot 8 ──
  [
    {
      id: 8,
      title: '赌注',
      description: '如果有50%的概率让{name}实现理想人生，但另外50%是回到比现在更差的起点。{name}赌吗？',
      choices: [
        { id: '8-1a', text: '不赌，现在的生活已经还行了', effects: { action: -2, connection: 1 }, clawReaction: '{name}选择了确定性。但\'还行\'的生活，也意味着\'不会更好\'。' },
        { id: '8-1b', text: '要看具体是什么机会', effects: { judgment: 3, cognition: 2 }, clawReaction: '{name}不盲目冒险。好创业者不是赌徒——他们是风险管理者。' },
        { id: '8-1c', text: '赌，但会想办法把失败的代价降到最低', effects: { judgment: 5, action: 3, cognition: 3 }, clawReaction: '{name}不赌命，赌策略。把大风险拆小，一步步推进，这才是真正的创业思维。' },
        { id: '8-1d', text: '直接赌，人生就是不能太安全', effects: { action: 5, judgment: 2, connection: -1 }, clawReaction: '{name}选择了全力以赴。勇气是一种稀缺资源，但勇气加上判断力才等于力量。' },
      ],
    },
    {
      id: 8,
      title: '同龄人的压力',
      description: '{name}的同学们纷纷拿到了大厂offer、名校录取、体面工作。而{name}还在"想"。{name}的状态是？',
      choices: [
        { id: '8-2a', text: '焦虑，觉得自己落后了', effects: { judgment: -2, action: -1, connection: 1 }, clawReaction: '{name}开始怀疑自己。但\'落后\'的前提是大家在同一条赛道上。也许你根本不在那条赛道。' },
        { id: '8-2b', text: '有压力，但知道那不是自己想要的', effects: { judgment: 3, cognition: 2 }, clawReaction: '{name}能分辨别人的好和自己想要的好。这种判断力，比任何offer都值钱。' },
        { id: '8-2c', text: '不在意，每个人有自己的时间表', effects: { judgment: 4, cognition: 3, action: 1 }, clawReaction: '{name}不跟别人比进度。巴菲特99%的财富来自60岁之后——时间表从来不是线性的。' },
        { id: '8-2d', text: '反而更坚定了——越多人选那条路，机会就越不在那里', effects: { judgment: 5, action: 4, cognition: 3 }, clawReaction: '{name}在别人扎堆的地方看到了拥挤，在没人走的路上看到了机会。' },
      ],
    },
    {
      id: 8,
      title: '只有自己相信',
      description: '{name}有一个想法，但身边所有人——父母、朋友、导师——都说不行。{name}会？',
      choices: [
        { id: '8-3a', text: '放弃，也许他们是对的', effects: { judgment: -3, action: -3, connection: 1 }, clawReaction: '{name}收回了那个想法。但它不会消失，只会在某个深夜再次出现。' },
        { id: '8-3b', text: '动摇，但心里那个声音还在', effects: { judgment: 1, cognition: 1, action: -1 }, clawReaction: '{name}表面上放弃了，但浏览器历史记录暴露了一切——{name}每天还在搜相关的内容。' },
        { id: '8-3c', text: '不跟他们争，默默去找数据和案例验证', effects: { judgment: 5, cognition: 4, action: 3 }, clawReaction: '{name}不用嘴巴反驳，用事实说话。创业者的底层能力之一就是——在质疑中保持冷静。' },
        { id: '8-3d', text: '更想做了——历史上改变世界的想法，一开始都被所有人否定', effects: { judgment: 4, action: 5, cognition: 2, connection: -1 }, clawReaction: '{name}想到了当年所有人都笑话马云做互联网的故事。反对声最大的时候，往往正是开始的最好时机。' },
      ],
    },
  ],

  // ── Slot 9 ──
  [
    {
      id: 9,
      title: '时间的重量',
      description: '假设{name}现在25岁。有人告诉{name}：30岁之后，你的探索能力、试错勇气、学习速度都会明显下降。{name}怎么想？',
      choices: [
        { id: '9-1a', text: '不信，年纪大了反而更成熟', effects: { cognition: 1 }, clawReaction: '{name}不认同这个说法。成熟是真的，但冒险的窗口期也是真的。' },
        { id: '9-1b', text: '有点慌，但不知道该做什么', effects: { action: -1, cognition: 1 }, clawReaction: '{name}感到了时间的紧迫，但紧迫感没有转化为行动。这是最常见的状态，也是最危险的。' },
        { id: '9-1c', text: '那就在25到30岁之间全力试错', effects: { action: 5, judgment: 4, cognition: 2 }, clawReaction: '{name}决定给自己五年的窗口期。大学后是一次分水岭——大脑从探索转向效率，社会从自由转向固化。' },
        { id: '9-1d', text: '今天就开始，不等到明天', effects: { action: 6, judgment: 4, cognition: 1 }, clawReaction: '{name}不再倒计时了。最好的时间是十年前，其次是现在。' },
      ],
    },
    {
      id: 9,
      title: '最坏的情况',
      description: '创业失败后最坏的情况是什么？这个结果{name}能承受吗？',
      choices: [
        { id: '9-2a', text: '浪费时间，落后于同龄人——承受不了', effects: { judgment: -1, action: -3 }, clawReaction: '{name}把时间看成了有限的资源。但创业中的\'浪费\'，往往是另一种形式的积累。' },
        { id: '9-2b', text: '欠债、丢面子——很难承受', effects: { cognition: 1, action: -2 }, clawReaction: '{name}害怕物质和社会层面的代价。但你现在没有高薪、房贷、头衔——身份包袱最轻的时候，就是现在。' },
        { id: '9-2c', text: '回到起点重新开始——可以接受', effects: { judgment: 3, action: 3, cognition: 2 }, clawReaction: '{name}算了一笔账：最坏就是回到起点。而起点，也不是什么可怕的地方。' },
        { id: '9-2d', text: '最坏也就是得到了一次真实的成长——完全能接受', effects: { judgment: 5, action: 4, cognition: 4 }, clawReaction: '{name}把失败重新定义了——不是终点，而是学费。第一次创业最值钱的资产，是判断力的形成。' },
      ],
    },
    {
      id: 9,
      title: '深夜的声音',
      description: '凌晨两点睡不着，{name}脑子里反复出现的想法是什么？',
      choices: [
        { id: '9-3a', text: '明天的deadline和待办事项', effects: { action: 1 }, clawReaction: '{name}被当下的事情填满了。没有空隙，也就没有新的可能性长出来。' },
        { id: '9-3b', text: '对现状的不满，但不知道出路在哪', effects: { judgment: 1, cognition: 1, action: -1 }, clawReaction: '{name}感到了一种模糊的不安。这种不安是有价值的——它是改变的前兆。' },
        { id: '9-3c', text: '一个反复出现的想法——如果能把某件事做出来就好了', effects: { judgment: 4, cognition: 3, action: 3 }, clawReaction: '{name}脑子里有一颗种子，它一直在那里。反复出现的想法，值得被认真对待。' },
        { id: '9-3d', text: '对世界为什么是这样运转的思考', effects: { cognition: 5, judgment: 4, action: 1 }, clawReaction: '{name}在想本质的问题。这种人要么成为学者，要么成为创业者——两者都在用不同方式理解世界。' },
      ],
    },
  ],

  // ── Slot 10 ──
  [
    {
      id: 10,
      title: '向死而生',
      description: '假设{name}只剩5年可活。{name}会怎么度过？',
      choices: [
        { id: '10-1a', text: '陪家人、旅行，做让自己开心的事', effects: { connection: 3 }, clawReaction: '{name}选择了爱和体验。这是美好的选择，但它回避了一个问题——你想留下什么？' },
        { id: '10-1b', text: '把想学的东西都学一遍', effects: { cognition: 3, action: 1, judgment: 1 }, clawReaction: '{name}选择了知识。但知识不被使用，就只是信息。' },
        { id: '10-1c', text: '去做那件一直想做但不敢做的事', effects: { action: 5, judgment: 5, cognition: 2 }, clawReaction: '{name}终于给了自己许可。但为什么要等到\'只剩5年\'才给？' },
        { id: '10-1d', text: '创造一个东西，让它在我走后还能帮助别人', effects: { judgment: 5, action: 4, cognition: 3, connection: 3 }, clawReaction: '{name}想要的不只是活过，而是存在过。创业，本质上就是创造比你活得更久的东西。' },
      ],
    },
    {
      id: 10,
      title: '你是谁',
      description: '抛开所有外在标签——学校、专业、家庭背景、朋友评价——{name}觉得自己的核心是什么？',
      choices: [
        { id: '10-2a', text: '说不清楚，还没想过这个问题', effects: { judgment: -1, action: -1 }, clawReaction: '{name}第一次认真面对这个问题。这个问题本身，就是探索的开始。' },
        { id: '10-2b', text: '一个善良的人，希望身边人都好', effects: { connection: 3 }, clawReaction: '{name}的善良是真实的。但善良加上行动力，才能真正帮到更多人。' },
        { id: '10-2c', text: '一个不安分的人，总觉得可以做点什么', effects: { judgment: 3, action: 4, cognition: 2 }, clawReaction: '{name}骨子里有一种不服从。不是叛逆，是本能地觉得世界可以更好。' },
        { id: '10-2d', text: '一个还在形成中的人——但方向越来越清晰了', effects: { judgment: 5, cognition: 4, action: 3, connection: 1 }, clawReaction: '{name}还没定型，但正在成型。这恰恰是最有潜力的状态——刀还没拔出来，但已经在发热。' },
      ],
    },
    {
      id: 10,
      title: '最后的问题',
      description: '如果今天有一个人——可能是投资人、可能是导师、可能是未来的你——看着{name}的眼睛说：\'我看到你了。你准备好了吗？\'{name}的回答是？',
      choices: [
        { id: '10-3a', text: '我还没准备好，再给我一些时间', effects: { cognition: 1, connection: 1, action: -2 }, clawReaction: '{name}选择了等待。但好的创业者知道——永远没有准备好的时刻。' },
        { id: '10-3b', text: '我不确定，但我愿意试试', effects: { action: 3, judgment: 2, cognition: 1, connection: 1 }, clawReaction: '{name}迈出了第一步。不确定但愿意开始——这本身就是一种勇气。' },
        { id: '10-3c', text: '我准备好了。告诉我下一步做什么', effects: { action: 5, judgment: 3, cognition: 1, connection: 1 }, clawReaction: '{name}的眼睛亮了。真正的开始，从一个小实验开始，从一个真实的问题开始。' },
        { id: '10-3d', text: '我早就在路上了，只是还没人注意到', effects: { judgment: 5, action: 5, cognition: 3 }, clawReaction: '{name}笑了。那种笑容背后，是早已开始的探索、沉默的努力、和一颗不需要掌声的心。' },
      ],
    },
  ],
]
