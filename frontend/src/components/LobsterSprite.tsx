import { useState, useEffect } from 'react';
import { getStageByAge } from '../config/transitionConfig';

interface LobsterSpriteProps {
  age: number;
  action?: 'idle' | 'walk' | 'run';
  size?: number;
}

export default function LobsterSprite({ age, action = 'idle', size = 80 }: LobsterSpriteProps) {
  const [frame, setFrame] = useState(1);

  // 根据动作和阶段映射文件名
  const getActionName = (stage: string, action: string) => {
    const actionNameMap: Record<string, Record<string, string>> = {
      '婴儿': { idle: '待机', walk: '正面走', run: '奔跑' },
      '青少年': { idle: '待机', walk: '正面走', run: '奔跑' },
      '商务': { idle: '待机', walk: '正面走', run: '奔跑' },
    };
    return actionNameMap[stage]?.[action] || '待机';
  };

  const stage = getStageByAge(age);
  const actionName = getActionName(stage, action);
  const imagePath = `/images/claw/${stage}${actionName}${frame}.png`;

  // 两帧动画切换
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => prev === 1 ? 2 : 1);
    }, 600);
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
