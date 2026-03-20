import { useNavigate } from 'react-router-dom';
import { stage1Activities, stage2Activities } from '../game/activities';
import { useGameStore } from '../store/gameStore';

export default function ActivitySelectPage() {
  const navigate = useNavigate();
  const { lobster, canEnterEnding, generateAIEnding, setReflectionEnding, aiGeneratedEnding, isGeneratingEnding } = useGameStore();

  const activities = lobster.stage === 1 ? stage1Activities : stage2Activities;
  const backgroundImage = lobster.stage === 1
    ? "url('/images/背景/学校和街区背景_1.png')"
    : "url('/images/背景/虚拟工作空间_1.png')";

  const handleSelect = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    // 跳转到活动过渡动画
    navigate('/transition', { state: { activity } });
  };

  // 处理结局点击 - 先让AI生成结局类型，再跳转
  const handleEndingClick = async () => {
    // 如果还没有AI结局，先生成
    if (!aiGeneratedEnding && !isGeneratingEnding) {
      await generateAIEnding();
    }

    // 设置反思结局（用于页面显示）
    if (aiGeneratedEnding) {
      setReflectionEnding({
        trigger: true,
        type: aiGeneratedEnding.type,
        reason: aiGeneratedEnding.reason
      });
    }

    // 跳转到对应结局页面
    navigate(getEndingRoute());
  };

  // 根据阶段决定跳转到哪个结局
  const getEndingRoute = () => {
    if (lobster.stage === 2) {
      return '/final-ending';
    }
    return '/result';
  };

  return (
    <div
      className="min-h-screen flex flex-col p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage }}
    >
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

      {/* 图标网格 - 一排3个 */}
      <div className="flex-1 grid grid-cols-3 gap-3 content-start px-1">
        {activities.map(activity => (
          <button
            key={activity.id}
            onClick={() => handleSelect(activity.id)}
            className="aspect-[4/3] rounded-lg flex flex-col items-center justify-center hover:opacity-80 transition-opacity p-2"
            style={{ backgroundColor: '#c2c2c2' }}
          >
            <img
              src={activity.icon}
              alt={activity.name}
              className="w-16 h-16 object-contain mb-2"
            />
            <span className="text-sm font-medium" style={{ color: '#000000' }}>{activity.name}</span>
          </button>
        ))}
      </div>

      {/* 底部提示和结局入口 */}
      <div className="h-20 flex flex-col items-center justify-center gap-2">
        {canEnterEnding() ? (
          <button
            onClick={handleEndingClick}
            disabled={isGeneratingEnding}
            className="w-full h-12 bg-gradient-to-r from-[#0ea5e9] to-[#10b981] text-white rounded-xl text-base font-medium animate-pulse disabled:opacity-50"
          >
            {isGeneratingEnding ? 'AI正在总结...' : (lobster.stage === 1 ? '📜 查看成长报告' : '📖 查看人生结局')}
          </button>
        ) : (
          <p className="text-xs text-white/60">
            {lobster.stage === 1 ? '有时候它会有自己的想法' : '从全面发展到只看钱'}
          </p>
        )}
      </div>
    </div>
  );
}
