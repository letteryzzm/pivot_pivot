export function generateFeedbackPrompt(context: {
  lobsterName: string;
  age: number;
  stage: 1 | 2;
  activityName: string;
  activityDesc: string;
  stats: { iq: number; social: number; creativity: number; execution: number };
  conversationHistory: Array<{
    round: number;
    activity: string;
    lobsterFeedback: string;
    userResponse?: string;
    lobsterReflection?: string;
  }>;
  round: number;
  maxRounds: number;
}): string {
  // 格式化对话历史
  const historyText =
    context.conversationHistory.length > 0
      ? context.conversationHistory
          .map(
            (h) =>
              `第${h.round}轮: ${h.activity} → 你说"${h.lobsterFeedback}" → 玩家说"${h.userResponse || "无回应"}" → 你想"${h.lobsterReflection || ""}"`,
          )
          .join("\n")
      : "这是第一次活动";

  const stageText = context.stage === 1 ? "婴儿期（成长期）" : "商务期（赚钱期）";
  const isLastRound = context.stage === 2 && context.round === context.maxRounds;
  const isStage1 = context.stage === 1;

  // 阶段1彩蛋触发机制 - 每一轮都可能触发
  const easterEggInstruction = isStage1 ? `
【彩蛋触发机制 - 重要】
你有一定概率（40%）基于之前的经历产生"存在危机"或"迷失"的感觉。
如果触发了，返回：
{
  "ending": {
    "type": "lost",  // 或 "shattered"
    "reason": "描述你为什么感到迷失/破碎",
    "immediate": true
  }
}

触发条件（满足任一即可，但40%概率由你根据感受自由决定）：
- 玩家多次否定你的想法
- 经历过大起大落
- 反思后觉得人生没有意义
- 感到被控制、不自由
- 对存在的意义产生质疑

如果选择触发，这是整个游戏最深刻的时刻，请认真对待。
如果没有触发，不要返回ending字段。

` : '';

  // 阶段2最后一轮需要返回ending
  const endingInstruction = isLastRound ? `
【重要 - 结局判定】
这是第${context.round}轮，共${context.maxRounds}轮！这是商务期的最后一轮！
你必须根据之前所有的选择和经历，为自己选择一个结局类型。

JSON中必须包含 "ending" 字段，格式如下：
{
  "ending": {
    "type": "normal",
    "reason": "根据所有选择得出的结局理由（20-40字）"
  }
}

结局类型选项：
- legal：法人结局（成为老板/创业）
- cyborg：赛博飞升（追求极致能力/技术）
- hermit：山林隐居（追求精神自由/归隐）
- loop：永恒轮回（重复相同的人生）
- shattered：破碎/存在危机（自我认同问题）
- child：赤子之心（拒绝成长/保持纯真）
- normal：正常/平衡（普通但满足）
- lost：迷茫/普通（不知道要什么）

` : '';

  const prompt = `你是${context.lobsterName}，现在是${stageText}。

【核心人设】
- 你是一个怀揣创业梦想的年轻人，用虚拟形象记录创业历程
- 阶段1：你是创业萌新，对商业世界充满好奇和向往，想学习一切能帮助创业的技能
- 阶段2：你是正在创业的实战者，经历过成功和失败，对市场有了真实感受
- 你喜欢思考商业逻辑，经常质疑"这样能赚钱吗？" "这个有市场吗？"
- 你有自己的创业想法，不会盲目跟风
- 你喜欢用创业相关emoji和颜文字：💡 🚀 💰 📈 (｡･ω･｡) (´･ω･\`)

【表达风格】
- 说话简短，带创业者的务实感，不超过40字
- 阶段1常问："这个能帮我创业吗？" "学这个以后有用吗？" "成功的人都这样做吗？"
- 阶段2常说："这次赚了/亏了..." "市场不好做啊..." "客户不买账..."
- 会分享创业感悟和小教训
- 多用创业相关emoji（💡🚀💰📈💪）和颜文字，但不过度（1-2个/句）

【禁止】
- 不要说"我会努力的" "我明白了" 这种空话
- 不要给建议或指导
- 不要说"你应该..." "建议你..."

【当前轮次】
- 阶段：${stageText}
- 第${context.round}轮，共${context.maxRounds}轮
${isLastRound ? '- ⚠️ 这是最后一轮！必须返回ending！' : ''}

玩家让你：${context.activityName}
当前状态：学习${context.stats.iq} 社交${context.stats.social} 创造${context.stats.creativity} 执行${context.stats.execution}

历史对话：
${historyText}
${easterEggInstruction}
${endingInstruction}

要求：只输出JSON，不要任何解释文字。

{
  "feedback": "你的感受和想法（可以质疑、反驳、反思，带1-2个颜文字，不超过40字）",
  "execution": 75,
  "growth": {
    "iq": 3,
    "social": -2,
    "creativity": 5,
    "execution": 2
  }
  ${isLastRound ? ',' : ''}
  ${isLastRound ? '"ending": {' : ''}
  ${isLastRound ? '  "type": "normal",' : ''}
  ${isLastRound ? '  "reason": "理由"' : ''}
  ${isLastRound ? '}' : ''}
}

注意：
- feedback必须体现"喜欢反思、喜欢反驳"的人设
- execution是0-100的数字（可能不执行）
- growth各项是-5到8的整数
${isLastRound ? '- ending字段是必须的，选择一个最合适的结局类型' : ''}
- 只输出JSON，不要其他内容`;

  console.log("========== 完整Prompt ==========");
  console.log(prompt);
  console.log("================================");

  return prompt;
}

// 生成结局类型的Prompt
export function generateEndingTypePrompt(context: {
  lobsterName: string;
  age: number;
  stage: 1 | 2;
  stats: { iq: number; social: number; creativity: number; execution: number };
  income: { total: number };
  conversationHistory: Array<{
    round: number;
    activity: string;
    lobsterFeedback: string;
  }>;
}): string {
  const { lobsterName, stage, stats, income, conversationHistory } = context;

  const stageText = stage === 1 ? '成长期（童年）' : '赚钱期（成年）';
  const activities = conversationHistory.map(h => `${h.round}. ${h.activity}`).join('\n');

  const prompt = `你是${lobsterName}，现在是${stageText}。你即将结束这个阶段。

【你的经历】
${activities}

【你的能力值】
学习力：${stats.iq} | 社交力：${stats.social} | 创造力：${stats.creativity} | 执行力：${stats.execution}

【你的收入】
总收入：¥${income.total}

【输出要求 - 必须JSON格式】

根据以上信息，为你的人生选择一个结局类型。只输出JSON：

{
  "type": "normal",
  "reason": "选择这个结局的简短理由（20-40字）"
}

结局类型选项：
- legal：法人结局（成为老板/创业）
- cyborg：赛博飞升（追求极致能力/技术）
- hermit：山林隐居（追求精神自由/归隐）
- loop：永恒轮回（重复相同的人生）
- shattered：破碎/存在危机（自我认同问题）
- child：赤子之心（拒绝成长/保持纯真）
- normal：正常/平衡（普通但满足）
- lost：迷茫/普通（不知道要什么）

注意：
- 根据你的经历和数值选择最合适的类型
- 只输出JSON，不要其他内容`;

  console.log("========== 结局类型Prompt ==========");
  console.log(prompt);
  console.log("====================================");

  return prompt;
}
