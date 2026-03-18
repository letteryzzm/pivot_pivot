import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { determineEnding, calculateEntrepreneurScore } from '../game/endings';
import LobsterSprite from '../components/LobsterSprite';

export default function ResultPage() {
  const navigate = useNavigate();
  const { lobster } = useGameStore();
  const ending = determineEnding(lobster);
  const entrepreneurScore = calculateEntrepreneurScore(lobster);

  return (
    <div
      className="min-h-screen flex flex-col gap-4 p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/背景/欢迎屏幕背景_4.png')" }}
    >
      {/* 标题区域 */}
      <div className="bg-white rounded-2xl h-[120px] flex flex-col items-center justify-center gap-1">
        <h1 className="text-2xl font-semibold text-[#18181b]">{lobster.name}的成长报告</h1>
        <p className="text-sm text-[#71717a]">一起经历的时间：{lobster.history.round} 个成长节点</p>
      </div>

      {/* 龙虾区域 */}
      <div className="flex flex-col items-center gap-2">
        <LobsterSprite age={lobster.age} action="idle" size={120} />
        <div className="px-1.5 py-1.5 bg-[#10b981] rounded">
          <span className="text-xs text-white font-medium">{ending.title}</span>
        </div>
      </div>

      {/* 数据区域 */}
      <div className="flex gap-3">
        <div className="flex-1 bg-white rounded-xl p-3 flex flex-col gap-2">
          <p className="text-xs text-[#71717a]">能力成长轨迹</p>
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[#71717a]">学习能力</span>
              <span className="text-[#18181b] font-semibold">{lobster.stats.iq}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#71717a]">社交能力</span>
              <span className="text-[#18181b] font-semibold">{lobster.stats.social}</span>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl p-3 flex flex-col gap-2">
          <p className="text-xs text-[#71717a]">&nbsp;</p>
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[#71717a]">创造力</span>
              <span className="text-[#18181b] font-semibold">{lobster.stats.creativity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#71717a]">执行力</span>
              <span className="text-[#18181b] font-semibold">{lobster.stats.execution}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 收入显示 */}
      <div className="bg-white rounded-xl p-3 flex justify-between items-center">
        <span className="text-sm text-[#71717a]">赚到的钱</span>
        <span className="text-xl font-semibold text-[#10b981] font-mono">¥{lobster.income.total}</span>
      </div>

      {/* 创业成功概率 */}
      <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-2">
        <p className="text-sm text-[#71717a]">如果它去创业...</p>
        <p className="text-base font-medium text-[#18181b]">成功概率</p>
        <p className="text-5xl font-semibold text-[#0ea5e9] font-mono">{entrepreneurScore.toFixed(1)}%</p>
      </div>

      {/* 龙虾评价 */}
      <div className="bg-white rounded-2xl p-4 flex flex-col gap-3">
        <p className="text-sm text-[#18181b] text-center leading-relaxed">
          {ending.description}
        </p>
        <div className="w-full h-px bg-[#e5e7eb]"></div>
        <div className="flex flex-col gap-2 text-xs text-[#71717a] text-center leading-relaxed">
          <p>这段陪伴值得吗？</p>
          <p>如果重来，你会做不同的选择吗？</p>
          <p>AI的成长，真的需要人的时间吗？</p>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => navigate('/')}
          className="w-full h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium"
        >
          重新开始一段陪伴
        </button>
        <p className="text-xs text-white/60 text-center">每一次陪伴都是独特的 · 因为时间不会重来</p>
      </div>
    </div>
  );
}
