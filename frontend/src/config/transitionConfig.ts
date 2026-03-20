// 阶段类型
export type StageType = "婴儿" | "商务";

// 背景配置
export const stageBackgrounds: Record<StageType, string[]> = {
  婴儿: [
    "/images/背景/学校和街区背景_1.png",
    "/images/背景/学校和街区背景_2.png",
  ],
  商务: [
    "/images/背景/虚拟工作空间_1.png",
    "/images/背景/虚拟工作空间_2.png",
    "/images/背景/虚拟工作空间_3.png",
    "/images/背景/虚拟工作空间_4.png",
  ],
};

// 动作类型
export type ActionType = "idle" | "walk" | "run";

// 路径点配置
export interface Waypoint {
  x: number; // 百分比 (0-100)
  y: number; // 百分比 (0-100)
  action: ActionType;
}

// 过渡动画配置
export interface TransitionConfig {
  fromStage: StageType;
  toStage: StageType;
  duration: number; // 动画总时长 (ms)
  waypoints: Waypoint[]; // 路径点，从起点到终点
}

// 根据阶段获取背景图
export function getRandomBackground(stage: StageType): string {
  const backgrounds = stageBackgrounds[stage];
  return backgrounds[Math.floor(Math.random() * backgrounds.length)];
}

// 过渡动画配置
export const transitionConfigs: Record<string, TransitionConfig> = {
  // 婴儿 → 商务
  "婴儿-商务": {
    fromStage: "婴儿",
    toStage: "商务",
    duration: 3000,
    waypoints: [
      { x: 10, y: 70, action: "idle" },
      { x: 30, y: 70, action: "walk" },
      { x: 50, y: 65, action: "walk" },
      { x: 70, y: 70, action: "walk" },
      { x: 90, y: 70, action: "run" },
    ],
  },
};

// 根据阶段名称获取过渡配置
export function getTransitionConfig(
  fromStage: StageType,
  toStage: StageType,
): TransitionConfig {
  const key = `${fromStage}-${toStage}`;
  return (
    transitionConfigs[key] || {
      fromStage,
      toStage,
      duration: 3000,
      waypoints: [
        { x: 10, y: 70, action: "idle" },
        { x: 50, y: 65, action: "walk" },
        { x: 90, y: 70, action: "run" },
      ],
    }
  );
}

// 阶段顺序
export const stageOrder: StageType[] = [
  "婴儿",
  "商务",
];

// 根据阶段获取显示用的阶段类型
export function getStageByAge(_age: number, stage: 1 | 2): StageType {
  if (stage === 1) return "婴儿";
  return "商务";
}
