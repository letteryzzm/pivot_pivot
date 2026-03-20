import { useGameStore } from '../store/gameStore';
import { useLocation } from 'react-router-dom';

export default function StatBar() {
  const { lobster, isPlaying } = useGameStore();
  const location = useLocation();

  // 开始页面不显示
  if (location.pathname === '/') return null;

  // 游戏未开始时不显示
  if (!isPlaying) return null;

  const stats = [
    { key: 'iq', label: '学', value: lobster.stats.iq },
    { key: 'social', label: '社', value: lobster.stats.social },
    { key: 'creativity', label: '创', value: lobster.stats.creativity },
    { key: 'execution', label: '行', value: lobster.stats.execution },
  ];

  return (
    <div className="absolute top-0 left-0 px-2 py-1 z-50">
      <div className="flex gap-3 text-[11px] font-semibold">
        {stats.map((stat) => (
          <span key={stat.key} className="text-black">
            {stat.label}:{stat.value}
          </span>
        ))}
      </div>
    </div>
  );
}
