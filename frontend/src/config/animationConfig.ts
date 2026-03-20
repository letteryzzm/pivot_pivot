// 动画配置 - 用于AI返回的 paramId 映射
// 每个配置包含：paramId、背景、3个关键点位置

export interface AnimationConfig {
  paramId: string;        // 参数ID，AI返回此ID触发
  background: string;      // 背景图片路径
  keypoints: {            // 3个关键点位置
    x: number;
    y: number;
  }[];
}

// 动画配置组（按阶段+动画类型分组）
export const animationConfigs: Record<string, AnimationConfig> = {
  // 婴儿 - idle (社交/艺术类)
  '婴儿_idle1_学校和街区背景_1': {
    paramId: '婴儿_idle_1',
    background: '/images/背景/学校和街区背景_1.png',
    keypoints: [
      { x: 10, y: 94 }, // 开始
      { x: 57, y: 93 }, // 中间
      { x: 67, y: 93 }, // 结束
    ],
  },
  '婴儿_idle1_学校和街区背景_2': {
    paramId: '婴儿_idle_1',
    background: '/images/背景/学校和街区背景_2.png',
    keypoints: [
      { x: 76, y: 96 }, // 开始
      { x: 42, y: 96 }, // 中间
      { x: 73, y: 95 }, // 结束
    ],
  },
  '婴儿_idle1_学校和街区背景_3': {
    paramId: '婴儿_idle_1',
    background: '/images/背景/学校和街区背景_3.png',
    keypoints: [
      { x: 87, y: 96 }, // 开始
      { x: 63, y: 95 }, // 中间
      { x: 38, y: 95 }, // 结束
    ],
  },
  '婴儿_idle1_学校和街区背景_4': {
    paramId: '婴儿_idle_1',
    background: '/images/背景/学校和街区背景_4.png',
    keypoints: [
      { x: 72, y: 95 }, // 开始
      { x: 40, y: 96 }, // 中间
      { x: 66, y: 94 }, // 结束
    ],
  },
  '婴儿_idle1_图书馆场景_1': {
    paramId: '婴儿_idle_1',
    background: '/images/背景/图书馆场景_1.png',
    keypoints: [
      { x: 77, y: 84 }, // 开始
      { x: 46, y: 82 }, // 中间
      { x: 15, y: 74 }, // 结束
    ],
  },
  // 商务 - idle (社交/艺术类)
  '商务_idle1_虚拟工作空间_1': {
    paramId: '商务_idle_1',
    background: '/images/背景/虚拟工作空间_1.png',
    keypoints: [
      { x: 14, y: 83 }, // 开始
      { x: 60, y: 84 }, // 中间
      { x: 62, y: 65 }, // 结束
    ],
  },
  '商务_idle1_虚拟工作空间_2': {
    paramId: '商务_idle_1',
    background: '/images/背景/虚拟工作空间_2.png',
    keypoints: [
      { x: 50, y: 65 }, // 开始
      { x: 63, y: 85 }, // 中间
      { x: 69, y: 69 }, // 结束
    ],
  },
  '商务_idle1_虚拟工作空间_3': {
    paramId: '商务_idle_1',
    background: '/images/背景/虚拟工作空间_3.png',
    keypoints: [
      { x: 80, y: 84 }, // 开始
      { x: 21, y: 75 }, // 中间
      { x: 29, y: 60 }, // 结束
    ],
  },
  '商务_idle1_虚拟工作空间_4': {
    paramId: '商务_idle_1',
    background: '/images/背景/虚拟工作空间_4.png',
    keypoints: [
      { x: 8, y: 87 }, // 开始
      { x: 52, y: 87 }, // 中间
      { x: 50, y: 69 }, // 结束
    ],
  },
};

// paramId 映射表 - AI返回paramId即可触发对应动画
export const paramIdToConfig: Record<string, string> = {
  '婴儿_idle_1': '婴儿_idle1_学校和街区背景_4',
  '商务_idle_1': '商务_idle1_虚拟工作空间_2',
};

// 活动类型分组
export type ActivityCategory = 'mental' | 'social' | 'action';

// 阶段类型
export type StageType = '婴儿' | '商务';

// 活动分类映射
export const activityCategoryMap: Record<string, ActivityCategory> = {
  // 阶段1：能力培养期
  'learn1': 'mental',   // 学习编程
  'learn2': 'mental',   // 读书
  'create1': 'mental',  // 独立思考
  'create2': 'mental',  // 做项目
  'exec1': 'action',    // 完成任务
  'exec2': 'action',    // 坚持习惯
  'social1': 'social',  // 参加社团
  'social2': 'social',  // 交朋友
  'art1': 'social',     // 学艺术
  'music1': 'social',   // 学音乐
  'sport1': 'action',   // 运动健身
  'write1': 'mental',   // 写作

  // 阶段2：赚钱期
  'code1': 'mental',   // 写代码
  'teach1': 'mental',  // 当老师
  'design1': 'mental', // 炒股
  'ecom1': 'action',   // 开超市
  'research1': 'action', // 体力活
  'job1': 'action',     // 找工作
};

// 根据阶段和动画类型获取配置ID
export function getAnimationConfigId(stage: StageType, category: ActivityCategory): string {
  // 查找匹配的已配置
  const matchedKey = Object.keys(animationConfigs).find(key =>
    key.startsWith(stage) && key.includes(category === 'social' ? 'idle' : category === 'mental' ? 'walk' : 'run')
  );

  if (matchedKey) return matchedKey;

  // 返回默认配置
  if (stage === '婴儿') {
    return '婴儿_idle1_学校和街区背景_4';
  }
  return '商务_idle1_虚拟工作空间_2';
}

// 根据paramId获取动画配置
export function getAnimationConfigByParamId(paramId: string): AnimationConfig | null {
  const configKey = paramIdToConfig[paramId];
  if (configKey && animationConfigs[configKey]) {
    return animationConfigs[configKey];
  }
  return null;
}
