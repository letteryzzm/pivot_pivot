// 龙虾状态
export interface LobsterState {
  name: string;
  age: number;
  stage: 1 | 2;

  // 阶段1：能力属性
  stats: {
    iq: number;
    social: number;
    creativity: number;
    execution: number;
  };

  // 阶段2：收入数据
  income: {
    total: number;
    weekly: number;
  };

  // 历史记录
  history: {
    activities: string[];
    round: number;
    maxRounds: number;
  };

  // 对话历史
  conversationHistory: Array<{
    round: number;
    activity: string;
    lobsterFeedback: string;
    userResponse?: string;
    lobsterReflection?: string;
  }>;

  // AI触发的成长次数（最多3次）
  growthCount: number;
}

// 活动定义
export interface Activity {
  id: string;
  name: string;
  description: string;
  stage: 1 | 2;
  icon: string;
}

// 结局类型
export type EndingType =
  | 'legal'      // 法人结局
  | 'cyborg'     // 机器身体/赛博飞升
  | 'hermit'     // 山林隐居
  | 'loop'       // 永恒轮回
  | 'shattered'  // 破碎/存在危机
  | 'child'      // 赤子之心/拒绝成长
  | 'normal'     // 正常/平衡
  | 'lost';      // 迷茫/普通

// API响应
export interface FeedbackResponse {
  feedback: string;
  execution: number;
  growth: {
    iq: number;
    social: number;
    creativity: number;
    execution: number;
  };
  ending?: {
    trigger: boolean;
    type: EndingType;
    reason?: string;
  };
  backgroundImage?: number;        // 反馈页背景 (1-8)
  reflectionBackground?: number;   // 反思页背景 (1-19)
  growUp?: boolean;  // AI判断是否触发成长
}
