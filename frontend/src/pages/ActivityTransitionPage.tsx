import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import type { StageType } from '../config/transitionConfig';
import { getRandomBackground, getStageByAge } from '../config/transitionConfig';

interface LocationState {
  activity: {
    id: string;
    name: string;
  };
}

export default function ActivityTransitionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const activity = state?.activity;
  const { lobster } = useGameStore();

  const [progress, setProgress] = useState(0);
  const [frameTick, setFrameTick] = useState(0); // 0-5: idle1,idle2,walk1,walk2,run1,run2
  const [background, setBackground] = useState('');

  const duration = 3000; // 3秒活动执行动画

  // 随机选择当前阶段的背景
  useEffect(() => {
    const stages: StageType[] = ['婴儿', '青少年', '商务'];
    const randomStage = stages[Math.floor(Math.random() * stages.length)];
    setBackground(getRandomBackground(randomStage));
  }, []);

  // 帧动画循环：每个动作完整播放2帧后再切换
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameTick(t => (t + 1) % 6); // 6个状态循环
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
        setTimeout(() => {
          navigate('/feedback', { state: { activity } });
        }, 300);
      }
    };
    requestAnimationFrame(animate);
  }, [navigate, activity]);

  // 根据帧tick确定当前动作和帧
  const { action, frame } = useMemo(() => {
    // tick: 0-1=idle, 2-3=walk, 4-5=run
    if (frameTick < 2) return { action: 'idle' as const, frame: frameTick + 1 };
    if (frameTick < 4) return { action: 'walk' as const, frame: frameTick - 1 };
    return { action: 'run' as const, frame: frameTick - 3 };
  }, [frameTick]);

  // 计算位置 - 从左走到右
  const { x, y } = useMemo(() => {
    const startX = 10;
    const endX = 90;
    const baseY = 65 + Math.random() * 10; // 65-75% 高度

    const currentX = startX + (endX - startX) * progress;
    const currentY = baseY;

    return { x: currentX, y: currentY };
  }, [progress]);

  // 根据年龄确定阶段
  const currentStage = useMemo(() => {
    return getStageByAge(lobster.age);
  }, [lobster.age]);

  // 获取图片路径
  const imagePath = useMemo(() => {
    const actionNameMap: Record<string, Record<string, string>> = {
      '婴儿': { idle: '待机', walk: '正面走', run: '奔跑' },
      '青少年': { idle: '待机', walk: '正面走', run: '奔跑' },
      '商务': { idle: '待机', walk: '正面走', run: '奔跑' },
    };
    const actionName = actionNameMap[currentStage]?.[action] || '待机';
    return `/images/claw/${currentStage}${actionName}${frame}.png`;
  }, [currentStage, action, frame]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景图 */}
      <img
        src={background}
        alt="背景"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 状态栏占位 */}
      <div className="h-[62px]"></div>

      {/* 活动名称提示 */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-white text-lg font-medium drop-shadow-lg">
        {activity?.name || '活动中...'}
      </div>

      {/* 龙虾 */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform"
        style={{
          left: `${x}%`,
          top: `${y}%`,
        }}
      >
        <img
          src={imagePath}
          alt="龙虾"
          className="w-24 h-24 object-contain"
        />
      </div>

      {/* 进度提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {Math.round(progress * 100)}%
      </div>
    </div>
  );
}
