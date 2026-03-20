import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getStageByAge } from '../config/transitionConfig';
import {
  animationConfigs,
  paramIdToConfig,
  activityCategoryMap,
} from '../config/animationConfig';

interface LocationState {
  activity?: {
    id: string;
    name: string;
  };
  // 成长过渡专用
  fromAge?: number;
  toAge?: number;
  // AI返回的动画参数ID
  animationId?: string;
}

export default function LobsterTransition() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { lobster, executeActivity } = useGameStore();

  // 状态
  const [progress, setProgress] = useState(0);
  const [frameTick, setFrameTick] = useState(0);
  const [config, setConfig] = useState<{
    background: string;
    keypoints: { x: number; y: number }[];
  } | null>(null);

  // 防止重复调用API
  const hasCalledApiRef = useRef(false);

  // 判断是成长过渡还是活动过渡
  const isGrowthTransition = state?.fromAge !== undefined && state?.toAge !== undefined;
  const activity = state?.activity;

  // 并行调用API（动画开始时同时调用）
  useEffect(() => {
    if (isGrowthTransition || !activity) return;
    if (hasCalledApiRef.current) return;
    hasCalledApiRef.current = true;

    console.log('过渡页：开始调用API', activity);
    executeActivity(activity).then(() => {
      console.log('过渡页：API调用完成');
    }).catch(err => {
      console.error('过渡页：API调用失败', err);
    });
  }, [activity, isGrowthTransition]);

  // 当前阶段
  const currentStage = getStageByAge(lobster.age);

  // 动画时长 7秒
  const duration = 7000;

  // 初始化动画配置
  useEffect(() => {
    // 优先使用AI返回的animationId
    if (state?.animationId) {
      const configKey = paramIdToConfig[state.animationId];
      if (configKey && animationConfigs[configKey]) {
        setConfig({
          background: animationConfigs[configKey].background,
          keypoints: animationConfigs[configKey].keypoints,
        });
        return;
      }
    }

    // 活动过渡：根据活动类型选择动画
    if (activity) {
      const category = activityCategoryMap[activity.id] || 'mental';
      const prefix = currentStage === '婴儿' ? '婴儿' : '商务';
      const configKey = prefix === '婴儿'
        ? (category === 'social' ? '婴儿_idle1_图书馆场景_1' : '婴儿_idle1_学校和街区背景_1')
        : (category === 'social' ? '商务_idle1_虚拟工作空间_3' : '商务_idle1_虚拟工作空间_2');

      if (animationConfigs[configKey]) {
        setConfig({
          background: animationConfigs[configKey].background,
          keypoints: animationConfigs[configKey].keypoints,
        });
      } else {
        // 默认配置
        setConfig({
          background: '/images/背景/学校和街区背景_1.png',
          keypoints: [
            { x: 10, y: 70 },
            { x: 50, y: 65 },
            { x: 90, y: 70 },
          ],
        });
      }
      return;
    }

    // 成长过渡：使用默认配置
    setConfig({
      background: '/images/背景/学校和街区背景_1.png',
      keypoints: [
        { x: 10, y: 70 },
        { x: 50, y: 65 },
        { x: 90, y: 70 },
      ],
    });
  }, [state?.animationId, activity, currentStage]);

  // 帧动画循环：每个动作完整播放2帧后再切换
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameTick(t => (t + 1) % 6);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // 动画进度
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 动画完成，直接跳转，不管API是否完成
        if (isGrowthTransition) {
          // 成长过渡完成，返回上一页
          navigate(-1);
        } else {
          // 活动过渡完成，跳转到反馈页
          navigate('/feedback', { state: { activity } });
        }
      }
    };
    requestAnimationFrame(animate);
  }, [navigate, activity, isGrowthTransition]);

  // 根据帧tick确定当前动作和帧
  // X轴移动用奔跑，Y轴移动用正面走
  const { action, frame } = useMemo(() => {
    if (!config) return { action: 'idle' as const, frame: 1 };

    const kp = config.keypoints;
    const xDiff = Math.abs(kp[2].x - kp[0].x);
    const yDiff = Math.abs(kp[2].y - kp[0].y);

    // X轴变化大用run，Y轴变化大用walk，变化都小用idle
    // 帧数只在1-2之间循环
    if (xDiff > 30) {
      if (frameTick < 2) return { action: 'walk' as const, frame: frameTick + 1 };
      return { action: 'run' as const, frame: frameTick <= 3 ? 2 : 1 };
    } else if (yDiff > 15) {
      if (frameTick < 2) return { action: 'idle' as const, frame: frameTick + 1 };
      return { action: 'walk' as const, frame: frameTick <= 3 ? 2 : 1 };
    }
    return { action: 'idle' as const, frame: frameTick < 2 ? 1 : 2 };
  }, [frameTick, config]);

  // 根据进度计算当前位置（使用3个关键点插值）
  const { x, y } = useMemo(() => {
    if (!config) return { x: 50, y: 65 };

    const { keypoints } = config;
    // 将进度分成两段：0-0.5（开始到中间），0.5-1（中间到结束）
    if (progress < 0.5) {
      const localProgress = progress * 2;
      return {
        x: keypoints[0].x + (keypoints[1].x - keypoints[0].x) * localProgress,
        y: keypoints[0].y + (keypoints[1].y - keypoints[0].y) * localProgress,
      };
    } else {
      const localProgress = (progress - 0.5) * 2;
      return {
        x: keypoints[1].x + (keypoints[2].x - keypoints[1].x) * localProgress,
        y: keypoints[1].y + (keypoints[2].y - keypoints[1].y) * localProgress,
      };
    }
  }, [progress, config]);

  // 获取图片路径
  const imagePath = useMemo(() => {
    const actionNameMap: Record<string, Record<string, string>> = {
      '婴儿': { idle: '待机', walk: '正面走', run: '侧面走' },
      '商务': { idle: '待机', walk: '正面走', run: '奔跑' },
    };
    const actionName = actionNameMap[currentStage]?.[action] || '待机';
    return `/images/claw/${currentStage}${actionName}${frame}.png`;
  }, [currentStage, action, frame]);

  // 显示内容
  const displayText = isGrowthTransition
    ? '成长中...'
    : (activity?.name || '活动中...');

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景图 */}
      <img
        src={config.background}
        alt="背景"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 状态栏占位 */}
      <div className="h-[62px]"></div>

      {/* 活动/成长提示 */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-white text-lg font-medium drop-shadow-lg">
        {displayText}
      </div>

      {/* 龙虾 */}
      <div
        className="absolute"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: '96px',
          height: '96px',
          marginLeft: '-48px',
          marginTop: '-48px',
        }}
      >
        <img
          src={imagePath}
          alt={`${currentStage}龙虾`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* 进度提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {Math.round(progress * 100)}%
      </div>
    </div>
  );
}
