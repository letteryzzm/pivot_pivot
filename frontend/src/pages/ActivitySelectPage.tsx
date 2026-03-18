import { useNavigate } from 'react-router-dom';
import { stage1Activities, stage2Activities } from '../game/activities';
import { useGameStore } from '../store/gameStore';
import { calculateIncome } from '../game/gameEngine';

export default function ActivitySelectPage() {
  const navigate = useNavigate();
  const { lobster, executeActivity, addIncome } = useGameStore();

  const activities = lobster.stage === 1 ? stage1Activities : stage2Activities;

  const handleSelect = async (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    if (lobster.stage === 1) {
      await executeActivity(activity);
      navigate('/feedback');
    } else {
      const income = calculateIncome(lobster, activity);
      addIncome(income);
      navigate('/result');
    }
  };

  return (
    <div className="min-h-screen bg-[#18181b] flex flex-col p-4">
      {/* 顶部标题 */}
      <div className="h-20 flex items-center justify-center relative">
        <span className="text-xl font-semibold text-white">
          {lobster.stage === 1 ? '选择活动' : '选择赚钱活动'}
        </span>
        {lobster.stage === 2 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#10b981] rounded-lg">
            <span className="text-sm text-white font-semibold font-mono">
              ¥{lobster.income.total}
            </span>
          </div>
        )}
      </div>

      {/* 图标网格 */}
      <div className="flex-1 grid grid-cols-3 gap-4 content-start">
        {activities.map(activity => (
          <button
            key={activity.id}
            onClick={() => handleSelect(activity.id)}
            className="aspect-square bg-[#2a2a2a] rounded-xl flex items-center justify-center text-5xl hover:bg-[#3a3a3a] transition-colors border-2 border-[#3a3a3a]"
          >
            {activity.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
