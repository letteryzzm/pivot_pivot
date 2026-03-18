import { useState, useEffect } from 'react';

interface LobsterSpriteProps {
  age: number;
  action?: 'idle' | 'walk' | 'run';
  size?: number;
}

export default function LobsterSprite({ age, action = 'idle', size = 80 }: LobsterSpriteProps) {
  const [frame, setFrame] = useState(1);

  // 根据年龄映射阶段
  const getStage = (age: number) => {
    if (age <= 5) return '婴儿';
    if (age <= 12) return '儿童';
    if (age <= 17) return '青少年';
    return '商务';
  };

  // 根据动作映射文件名
  const getActionName = (action: string) => {
    if (action === 'idle') return '待机';
    if (action === 'walk') return '侧面走';
    if (action === 'run') return '奔跑';
    return '待机';
  };

  const stage = getStage(age);
  const actionName = getActionName(action);
  const imagePath = `/images/claw/${stage}${actionName}${frame}.png`;

  // 两帧动画切换
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => prev === 1 ? 2 : 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <img
      src={imagePath}
      alt={`${stage}龙虾`}
      style={{ width: size, height: size }}
      className="object-contain"
    />
  );
}
