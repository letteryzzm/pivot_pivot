import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { useGameStore } from '../store/gameStore';
import { determineEndingWithTrigger, calculateEntrepreneurScore } from '../game/endings';
import LobsterSprite from './LobsterSprite';

interface SharePosterProps {
  onClose: () => void;
}

export default function SharePoster({ onClose }: SharePosterProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const { lobster, getEndingTrigger } = useGameStore();

  const trigger = getEndingTrigger();
  const ending = determineEndingWithTrigger(lobster, trigger);
  const entrepreneurScore = calculateEntrepreneurScore(lobster);

  const handleDownload = async () => {
    if (!posterRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        width: 402,
        height: 700,
        scale: 2,
        useCORS: true,
        backgroundColor: '#0c1929',
      });

      const link = document.createElement('a');
      link.download = `${lobster.name}_人生报告.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloaded(true);
    } catch (error) {
      console.error('生成图片失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-xl"
      >
        ✕
      </button>

      {/* 海报预览区域 */}
      <div className="w-[402px]">
        {/* 海报内容 - 用于生成图片 */}
        <div
          ref={posterRef}
          className="w-[402px] h-[700px] p-5 flex flex-col"
          style={{
            background: 'linear-gradient(180deg, #0c1929 0%, #1a3a5c 50%, #0c1929 100%)',
          }}
        >
          {/* 顶部：龙虾形象 */}
          <div className="flex flex-col items-center gap-2">
            <LobsterSprite age={lobster.age} action="idle" size={80} />
            <h2 className="text-xl font-semibold text-white">
              {lobster.name} · {lobster.age}岁
            </h2>
          </div>

          {/* 结局评判 */}
          <div className="mt-4 bg-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{ending.emoji}</span>
              <h3 className="text-base font-semibold text-white">{ending.title}</h3>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              {ending.description}
            </p>
          </div>

          {/* 能力展示 */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/60">学习能力</span>
                <span className="text-sm font-semibold text-white">{lobster.stats.iq}</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full transition-all"
                  style={{ width: `${lobster.stats.iq}%` }}
                />
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/60">社交能力</span>
                <span className="text-sm font-semibold text-white">{lobster.stats.social}</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full transition-all"
                  style={{ width: `${lobster.stats.social}%` }}
                />
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/60">创造力</span>
                <span className="text-sm font-semibold text-white">{lobster.stats.creativity}</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
                  style={{ width: `${lobster.stats.creativity}%` }}
                />
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/60">执行力</span>
                <span className="text-sm font-semibold text-white">{lobster.stats.execution}</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
                  style={{ width: `${lobster.stats.execution}%` }}
                />
              </div>
            </div>
          </div>

          {/* 收入和创业概率 */}
          <div className="mt-4 flex gap-3">
            <div className="flex-1 bg-emerald-500/20 rounded-xl p-3 flex flex-col items-center">
              <span className="text-xs text-white/60 mb-1">赚到的钱</span>
              <span className="text-lg font-semibold text-emerald-400">
                ¥{lobster.income.total.toLocaleString()}
              </span>
            </div>
            <div className="flex-1 bg-sky-500/20 rounded-xl p-3 flex flex-col items-center">
              <span className="text-xs text-white/60 mb-1">创业成功率</span>
              <span className="text-lg font-semibold text-sky-400">
                {entrepreneurScore.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* 核心文案 */}
          <div className="mt-auto pt-4">
            <div className="text-center">
              <p className="text-sm text-white/50 italic">
                "模型成人之路，需要人的陪伴"
              </p>
            </div>

            {/* 二维码位 */}
            <div className="mt-4 flex flex-col items-center">
              <div className="w-[80px] h-[80px] bg-white/10 rounded-xl flex items-center justify-center">
                <div className="w-[60px] h-[60px] border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-white/40 text-center">二维码</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-white/50">扫码一起养</p>
            </div>

            {/* 底部 */}
            <div className="mt-4 text-center">
              <p className="text-xs text-white/40">
                🦞 我的龙虾：{lobster.name}
              </p>
            </div>
          </div>
        </div>

        {/* 下载按钮 */}
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="mt-4 w-full h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium disabled:opacity-50"
        >
          {isGenerating ? '生成中...' : downloaded ? '已保存到相册' : '保存到相册'}
        </button>
      </div>
    </div>
  );
}
