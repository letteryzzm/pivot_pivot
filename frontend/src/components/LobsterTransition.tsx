import { useState, useEffect, useMemo } from 'react';
import type { StageType, TransitionConfig } from '../config/transitionConfig';
import { getRandomBackground, getTransitionConfig } from '../config/transitionConfig';

interface LobsterTransitionProps {
  fromAge: number;
  toAge: number;
  onComplete: () => void;
}

export default function LobsterTransition({ fromAge, toAge, onComplete }: LobsterTransitionProps) {
  const [progress, setProgress] = useState(0); // 0-1
  const [frame, setFrame] = useState(1);
  const [background, setBackground] = useState('');

  // 根据年龄获取阶段
  const getStageByAge = (age: number): StageType => {
    if (age <= 5) return '婴儿';
    if (age <= 12) return '儿童';
    if (age <= 17) return '少年';
    if (age < 18) return '青少年';
    return '商务';
  };

  const fromStage = getStageByAge(fromAge);
  const toStage = getStageByAge(toAge);

  // 获取过渡配置
  const config: TransitionConfig = useMemo(
    () => getTransitionConfig(fromStage, toStage),
    [fromStage, toStage]
  );

  // 随机选择背景
  useEffect(() => {
    setBackground(getRandomBackground(toStage));
  }, [toStage]);

  // 帧动画切换
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f === 1 ? 2 : 1));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // 动画进度
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / config.duration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 动画完成
        setTimeout(onComplete, 500);
      }
    };
    requestAnimationFrame(animate);
  }, [config.duration, onComplete]);

  // 根据进度计算当前位置
  const { x, y, action } = useMemo(() => {
    const { waypoints } = config;
    const totalSegments = waypoints.length - 1;
    const segmentProgress = progress * totalSegments;
    const currentSegment = Math.min(Math.floor(segmentProgress), totalSegments - 1);
    const segmentLocalProgress = segmentProgress - currentSegment;

    const from = waypoints[currentSegment];
    const to = waypoints[currentSegment + 1];

    return {
      x: from.x + (to.x - from.x) * segmentLocalProgress,
      y: from.y + (to.y - from.y) * segmentLocalProgress,
      action: segmentLocalProgress < 0.5 ? from.action : to.action,
    };
  }, [progress, config]);

  // 获取图片路径
  const imagePath = useMemo(() => {
    const actionName = {
      idle: '待机',
      walk: '侧面走',
      run: '奔跑',
    }[action];
    return `/images/claw/${toStage}${actionName}${frame}.png`;
  }, [toStage, action, frame]);

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
          alt={`${toStage}龙虾`}
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
