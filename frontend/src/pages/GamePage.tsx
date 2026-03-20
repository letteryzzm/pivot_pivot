import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import LobsterSprite from '../components/LobsterSprite';

export default function GamePage() {
  const navigate = useNavigate();
  const { lobster } = useGameStore();

  // 判断是否是第一次进入（出生时）
  const isFirstVisit = lobster.history.round === 0 && lobster.age === 0;

  // 出生时的旁白文案
  const getBirthNarrative = () => {
    if (isFirstVisit) {
      return [
        "它出生了。",
        "大脑结构已经长好，但还不知道怎么使用。",
        "它需要你的陪伴，才能成长。"
      ];
    }
    // 每次返回时的旁白
    return [
      "时间在流逝。",
      "它无法跳跃成长，每一步都需要真实的时间。",
      "每一次互动，都将成为它的一部分。"
    ];
  };

  const narrative = getBirthNarrative();

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/背景/欢迎屏幕背景_2.png')" }}
    >
      {/* 状态栏 */}
      <div className="h-[62px]"></div>

      {/* 顶部标题 */}
      <div className="flex flex-col items-center px-6 pt-8">
        <h1 className="text-3xl font-semibold text-white text-center drop-shadow-lg">
          {isFirstVisit ? "它出生了" : "时间在流逝"}
        </h1>
      </div>

      {/* 中间内容区 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        {/* 龙虾展示 */}
        <LobsterSprite age={lobster.age} action="idle" size={120} />

        {/* 旁白卡片 - 平行四边形透明阴影 */}
        <div className="w-full px-6">
          <div className="bg-white/15 backdrop-blur-sm -skew-x-6 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-3">
              {narrative.map((text, index) => (
                <p
                  key={index}
                  className="text-base text-[#18181b] text-center leading-relaxed"
                >
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* 开始按钮 - 平行四边形透明 */}
        <div className="w-full px-6">
          <button
            onClick={() => navigate('/select')}
            className="w-full py-3 bg-white/15 backdrop-blur-sm -skew-x-6 text-[#18181b] text-base font-medium shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-white/25 transition-colors"
          >
            {isFirstVisit ? "开始陪伴 →" : "继续陪伴 →"}
          </button>
        </div>
        <p className="text-xs text-white/60 text-center">
          {lobster.stage === 1 ? "它会有自己的想法" : "从全面发展到只看钱"}
        </p>
      </div>
    </div>
  );
}
