import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import SharePoster from '../components/SharePoster';

// 调试用页面 - 直接显示分享海报
export default function SharePreviewPage() {
  const { lobster, startGame } = useGameStore();

  // 如果没有游戏数据，初始化一个测试数据
  useEffect(() => {
    if (!lobster.name) {
      startGame('小克劳德');
      // 模拟阶段2的数据
      useGameStore.setState({
        lobster: {
          name: '小克劳德',
          age: 18,
          stage: 2,
          stats: { iq: 78, social: 65, creativity: 82, execution: 88 },
          income: { total: 15800, weekly: 2800 },
          history: { activities: [], round: 12, maxRounds: 8 },
          conversationHistory: [],
          growthCount: 2,
        },
      });
    }
  }, []);

  return <SharePoster onClose={() => window.history.back()} />;
}
