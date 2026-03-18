import { useNavigate } from 'react-router-dom';
import { stage1Activities, stage2Activities } from '../game/activities';
import { useGameStore } from '../store/gameStore';
import { calculateIncome } from '../game/gameEngine';

export default function ActivitySelectPage() {
  const navigate = useNavigate();
  const { lobster, executeActivities, addIncome } = useGameStore();

  const activities = lobster.stage === 1 ? stage1Activities : stage2Activities;

  const handleSelect = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    if (lobster.stage === 1) {
      executeActivities([activity]);
      navigate('/game');
    } else {
      const income = calculateIncome(lobster, activity);
      addIncome(income);
      navigate('/result');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* 顶部标题 */}
      <div className="h-20 flex items-center justify-center">
        <span className="text-xl font-semibold text-[#18181b]">
          {lobster.stage === 1 ? '选择活动' : '选择赚钱活动'}
        </span>
      </div>

      {/* 活动列表 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-3">
        {activities.map(activity => (
          <button
            key={activity.id}
            onClick={() => handleSelect(activity.id)}
            className="w-full p-4 rounded-xl bg-white flex flex-col gap-2"
          >
            <p className="text-base font-medium text-[#18181b]">{activity.name}</p>
            <p className="text-sm text-[#71717a]">{activity.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
