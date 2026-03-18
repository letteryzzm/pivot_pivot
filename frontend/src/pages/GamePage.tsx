import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import LobsterSprite from '../components/LobsterSprite';

export default function GamePage() {
  const navigate = useNavigate();
  const { lobster, currentFeedback } = useGameStore();

  const statLabels = {
    iq: '学习能力',
    social: '社交能力',
    creativity: '创造力',
    execution: '执行力'
  };

  const statColors = {
    iq: { bg: 'bg-blue-500', text: 'text-blue-600' },
    social: { bg: 'bg-green-500', text: 'text-green-600' },
    creativity: { bg: 'bg-purple-500', text: 'text-purple-600' },
    execution: { bg: 'bg-orange-500', text: 'text-orange-600' }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col gap-4 p-4">
      {/* 状态栏 */}
      <div className="h-[62px] flex items-center justify-center">
        <span className="text-sm text-[#18181b]">9:41</span>
      </div>

      {/* 头部信息 */}
      <div className="flex flex-col gap-1 items-center">
        <p className="text-sm text-[#71717a]">{lobster.name}</p>
        <p className="text-xl font-semibold text-[#18181b]">
          第 {lobster.history.round + 1} 次成长节点
        </p>
      </div>

      {/* 龙虾区域 */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center gap-4">
        <LobsterSprite age={lobster.age} action="idle" size={120} />
        {currentFeedback && (
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 w-full">
            <p className="text-sm text-[#18181b] whitespace-pre-line">{currentFeedback}</p>
          </div>
        )}
      </div>

      {/* 时间卡片 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-xs text-[#71717a] mb-1">距离下次成长节点</p>
        <p className="text-lg font-semibold text-[#18181b] mb-3">2 天 5 小时</p>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-1/3 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
      </div>

      {/* 能力面板 */}
      <div className="flex flex-col gap-3">
        {Object.entries(lobster.stats).map(([key, value]) => (
          <div key={key} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-[#18181b]">{statLabels[key as keyof typeof statLabels]}</span>
              <span className={`text-lg font-bold ${statColors[key as keyof typeof statColors].text}`}>{value}</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-2.5 ${statColors[key as keyof typeof statColors].bg} rounded-full transition-all duration-500`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 底部按钮 */}
      <div className="h-[72px] flex items-center justify-center">
        <button
          onClick={() => navigate('/select')}
          className="w-full h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium"
        >
          {lobster.stage === 1 ? '选择培养活动' : '选择赚钱方式'}
        </button>
      </div>
    </div>
  );
}
