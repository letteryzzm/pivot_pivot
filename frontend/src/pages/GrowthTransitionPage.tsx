import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import LobsterSprite from '../components/LobsterSprite';

export default function GrowthTransitionPage() {
  const navigate = useNavigate();
  const { lobster } = useGameStore();

  // 根据 round 和 age 确定成长阶段
  const getTransitionInfo = (round: number, stage: number, age: number) => {
    if (stage === 1) {
      // round 3: 童年·萌芽
      if (round === 3) {
        return {
          fromStage: '婴儿' as const,
          toStage: '儿童' as const,
          title: '童年·萌芽',
          description: `${lobster.name}慢慢长大`,
          hint: '它开始对外面的世界产生好奇...'
        };
      }
      // round 6: 少年·萌芽
      if (round === 6) {
        return {
          fromStage: '儿童' as const,
          toStage: '少年' as const,
          title: '少年·萌芽',
          description: `${lobster.name}进入了少年时期`,
          hint: '它开始发现自己擅长什么...'
        };
      }
      // round 8: 少年·觉醒
      if (round === 8) {
        return {
          fromStage: '少年' as const,
          toStage: '青少年' as const,
          title: '少年·觉醒',
          description: `${lobster.name}进入了青春期`,
          hint: '它开始质疑那些"天经地义"...'
        };
      }
    }
    // 阶段2：成年
    if (stage === 2) {
      return {
        fromStage: '青少年' as const,
        toStage: '商务' as const,
        title: '成年·独立',
        description: `${lobster.name}已经成年，走入社会`,
        hint: '它要开始自己的工作了...'
      };
    }
    return {
      fromStage: '婴儿' as const,
      toStage: '儿童' as const,
      title: '成长',
      description: '发生了变化',
      hint: ''
    };
  };

  const transitionInfo = getTransitionInfo(lobster.history.round, lobster.stage, lobster.age);

  // 自动跳转
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/select');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      <div className="h-[62px] flex items-center justify-center">
        <span className="text-sm text-[#18181b]">9:41</span>
      </div>

      <div className="flex flex-col items-center gap-2 mt-8">
        <p className="text-sm text-[#71717a]">成长时刻</p>
        <h1 className="text-2xl font-bold text-[#18181b]">{transitionInfo.title}</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-48 h-48 flex items-center justify-center">
          <LobsterSprite age={lobster.age} action="idle" size={140} />
        </div>

        <div className="mt-8 text-center px-6">
          <p className="text-lg text-[#18181b] mb-2">{transitionInfo.description}</p>
          <p className="text-sm text-[#71717a]">{transitionInfo.hint}</p>
        </div>
      </div>

      <div className="text-center pb-8">
        <p className="text-sm text-[#71717a]">
          {transitionInfo.fromStage} → {transitionInfo.toStage}
        </p>
        <p className="text-xs text-[#a1a1aa] mt-1">年龄: {lobster.age}岁</p>
      </div>
    </div>
  );
}
