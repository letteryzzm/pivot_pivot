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
    maxRounds: number; // 阶段1总轮数
  };
}

// 活动定义
export interface Activity {
  id: string;
  name: string;
  description: string;
  stage: 1 | 2;
  icon: string;
}

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
}
