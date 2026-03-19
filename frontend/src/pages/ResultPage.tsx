import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { determineEndingWithTrigger, calculateEntrepreneurScore } from '../game/endings';
import LobsterSprite from '../components/LobsterSprite';
import SharePoster from '../components/SharePoster';

export default function ResultPage() {
  const navigate = useNavigate();
  const [showSharePoster, setShowSharePoster] = useState(false);
  const { lobster, getEndingTrigger } = useGameStore();
  const trigger = getEndingTrigger();
  const ending = determineEndingWithTrigger(lobster, trigger);
  const entrepreneurScore = calculateEntrepreneurScore(lobster);

  const isGrowthReport = lobster.stage === 1;

  return (
    <>
      <div
        className="min-h-screen flex flex-col gap-4 p-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/背景/欢迎屏幕背景_4.png')" }}
      >
        {/* 标题区域 */}
        <div className="bg-white rounded-2xl h-[120px] flex flex-col items-center justify-center gap-1">
          <h1 className="text-2xl font-semibold text-[#18181b]">
            {isGrowthReport ? `${lobster.name}的童年报告` : `${lobster.name}的人生报告`}
          </h1>
          <p className="text-sm text-[#71717a]">
            {isGrowthReport
              ? `一起度过了 ${lobster.history.round} 个成长节点`
              : `共同经历 ${lobster.age} 年的人生旅程`
            }
          </p>
          {trigger && (
            <p className="text-xs text-[#10b981] mt-1">{trigger.reason}</p>
          )}
        </div>

        {/* 龙虾区域 */}
        <div className="flex flex-col items-center gap-2">
          <LobsterSprite age={lobster.age} action="idle" size={120} />
          <div className="px-1.5 py-1.5 bg-[#10b981] rounded">
            <span className="text-xs text-white font-medium">{ending.title}</span>
          </div>
        </div>

        {/* 阶段1：能力展示 | 阶段2：收入展示 */}
        {isGrowthReport ? (
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
        ) : (
          <div className="bg-white rounded-xl p-3 flex justify-between items-center">
            <span className="text-sm text-[#71717a]">赚到的钱</span>
            <span className="text-xl font-semibold text-[#10b981] font-mono">¥{lobster.income.total}</span>
          </div>
        )}

        {/* 阶段1隐藏 | 阶段2：创业成功概率 */}
        {!isGrowthReport && (
          <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-2">
            <p className="text-sm text-[#71717a]">如果它去创业...</p>
            <p className="text-base font-medium text-[#18181b]">成功概率</p>
            <p className="text-5xl font-semibold text-[#0ea5e9] font-mono">{entrepreneurScore.toFixed(1)}%</p>
          </div>
        )}

        {/* 龙虾评价 */}
        <div className="bg-white rounded-2xl p-4 flex flex-col gap-3">
          <p className="text-sm text-[#18181b] text-center leading-relaxed">
            {ending.description}
          </p>
          <div className="w-full h-px bg-[#e5e7eb]"></div>
          <div className="flex flex-col gap-2 text-xs text-[#71717a] text-center leading-relaxed">
            {isGrowthReport ? (
              <>
                <p>它将带着这些能力进入社会...</p>
                <p>接下来的路，会是怎样的呢？</p>
              </>
            ) : (
              <>
                <p>这段陪伴值得吗？</p>
                <p>如果重来，你会做不同的选择吗？</p>
                <p>AI的成长，真的需要人的时间吗？</p>
              </>
            )}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex flex-col gap-2">
          {/* 分享按钮 - 仅在阶段2（人生报告）显示 */}
          {!isGrowthReport && (
            <button
              onClick={() => setShowSharePoster(true)}
              className="w-full h-12 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white rounded-xl text-base font-medium"
            >
              生成海报分享
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="w-full h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium"
          >
            {isGrowthReport ? '继续陪伴它成长' : '重新开始一段陪伴'}
          </button>
          <p className="text-xs text-white/60 text-center">
            {isGrowthReport ? '它还没成年，还有无限可能' : '每一次陪伴都是独特的 · 因为时间不会重来'}
          </p>
        </div>
      </div>

      {/* 分享海报弹窗 */}
      {showSharePoster && <SharePoster onClose={() => setShowSharePoster(false)} />}
    </>
  );
}
