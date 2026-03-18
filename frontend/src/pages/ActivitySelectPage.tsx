import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stage1Activities, stage2Activities } from '../game/activities';
import { useGameStore } from '../store/gameStore';

export default function ActivitySelectPage() {
  const navigate = useNavigate();
  const { lobster } = useGameStore();
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const activities = lobster.stage === 1 ? stage1Activities : stage2Activities;
  const backgroundImage = lobster.stage === 1
    ? "url('/images/背景/学校和街区背景_1.png')"
    : "url('/images/背景/虚拟工作空间_1.png')";

  // 根据年龄选择龙虾形象
  const getLobsterImage = () => {
    const age = lobster.age;
    let ageGroup = '婴儿';
    if (age >= 18) ageGroup = '商务';
    else if (age >= 12) ageGroup = '青少年';
    else if (age >= 6) ageGroup = '儿童';

    // 随机选择一个动作
    const actions = ['正面走', '侧面走', '奔跑'];
    const action = actions[Math.floor(Math.random() * actions.length)];

    return `/images/claw/${ageGroup}${action}1.png`;
  };

  const handleSelect = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    setSelectedActivity(activity);
    setShowAnimation(true);

    // 1.5秒后跳转
    setTimeout(() => {
      navigate('/feedback', { state: { activity } });
    }, 1500);
  };

  return (
    <div
      className="min-h-screen flex flex-col p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage }}
    >
      {/* 加载动画覆盖层 */}
      {showAnimation && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
          <img
            src={getLobsterImage()}
            alt="龙虾动作"
            className="w-32 h-32 object-contain animate-bounce"
          />
          <p className="mt-4 text-white text-sm">
            {lobster.name}去{selectedActivity?.name}了...
          </p>
        </div>
      )}

      {/* 顶部标题 */}
      <div className="h-20 flex flex-col items-center justify-center relative">
        <span className="text-xl font-semibold text-white">
          {lobster.stage === 1 ? '今天做什么？' : '今天做什么能赚钱？'}
        </span>
        <span className="text-xs text-white/70 mt-1">
          {lobster.stage === 1 ? '它可能不会完全按你说的做' : ''}
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
            className="aspect-square bg-[#2a2a2a] rounded-xl flex items-center justify-center hover:bg-[#3a3a3a] transition-colors border-2 border-[#3a3a3a] p-3"
          >
            <img
              src={activity.icon}
              alt={activity.name}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="h-12 flex items-center justify-center">
        <p className="text-xs text-white/60">
          {lobster.stage === 1 ? '有时候它会有自己的想法' : '从全面发展到只看钱'}
        </p>
      </div>
    </div>
  );
}
