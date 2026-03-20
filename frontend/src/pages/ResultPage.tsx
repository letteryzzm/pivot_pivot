import { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { determineEndingWithTrigger, calculateEntrepreneurScore, determineAIEnding, getEndingBackground } from '../game/endings';
import { generateResultPagePrompt, parseResultPageResponse, getResultPageFallback } from '../utils/endingPrompt';
import { callAPI } from '../utils/api';
import { stage1Activities, stage2Activities } from '../game/activities';
import LobsterSprite from '../components/LobsterSprite';
import SharePoster from '../components/SharePoster';

interface AIResultContent {
  title: string;
  description: string;
  feeling: string;
  question: string;
}

export default function ResultPage() {
  const navigate = useNavigate();
  const [showSharePoster, setShowSharePoster] = useState(false);
  const [isShareMode, setIsShareMode] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const [aiContent, setAiContent] = useState<AIResultContent | null>(null);
  const [isAILoading, setIsAILoading] = useState(true);
  const hasGeneratedContent = useRef(false);  // 防止 useEffect 重复执行
  const { lobster, getEndingTrigger, reflectionEnding } = useGameStore();
  const trigger = getEndingTrigger();

  // 如果是反思页触发的结局，使用反思页结局
  const reflectionEndingTriggered = reflectionEnding?.trigger && reflectionEnding.type;
  const aiEnding = reflectionEndingTriggered && reflectionEnding.type ? determineAIEnding(reflectionEnding.type, reflectionEnding.reason) : null;
  const ending = aiEnding || determineEndingWithTrigger(lobster, trigger);

  const entrepreneurScore = calculateEntrepreneurScore(lobster);

  const isGrowthReport = lobster.stage === 1 || lobster.age < 6;
  const isAIEnding = !!aiEnding;

  // 截图分享
  const handleShare = async () => {
    if (!pageRef.current) return;

    // 进入分享模式，隐藏按钮
    setIsShareMode(true);

    // 等待 UI 更新
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const dataUrl = await toPng(pageRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `${lobster.name}_人生报告.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('截图失败:', error);
    } finally {
      // 退出分享模式，显示按钮
      setIsShareMode(false);
    }
  };

  // 获取背景图：优先使用AI触发的结局背景
  const backgroundImage = isAIEnding && reflectionEnding?.type
    ? getEndingBackground(reflectionEnding.type)
    : ending.backgroundImage || "/images/背景/欢迎屏幕背景_4.png";

  // AI 生成内容
  useEffect(() => {
    // 防止 React StrictMode 导致重复调用
    if (hasGeneratedContent.current) return;
    hasGeneratedContent.current = true;

    // 如果是 AI 触发的结局，跳过 AI 生成
    if (isAIEnding) {
      setIsAILoading(false);
      return;
    }

    const generateContent = async () => {
      try {
        const prompt = generateResultPagePrompt({
          lobster,
          stage1Activities,
          stage2Activities,
        });

        console.log('========== ResultPage Prompt ==========');
        console.log(prompt);
        console.log('=======================================');

        const fullText = await callAPI(prompt);

        const finalParsed = parseResultPageResponse(fullText);
        if (finalParsed) {
          setAiContent(finalParsed);
        } else {
          setAiContent(getResultPageFallback(lobster));
        }
      } catch (error) {
        console.error('生成 ResultPage 内容失败:', error);
        setAiContent(getResultPageFallback(lobster));
      } finally {
        setIsAILoading(false);
      }
    };

    generateContent();
  }, [lobster, isAIEnding]);

  return (
    <>
      <div
        ref={pageRef}
        className="min-h-screen flex flex-col gap-4 p-4 pb-20 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        {/* 标题区域 - 无容器 */}
        <div className="flex flex-col items-center gap-1 pt-8">
          <h1 className="text-2xl font-semibold text-white drop-shadow-lg text-center">
            {isAIEnding ? `${lobster.name}的觉醒时刻` : (isGrowthReport ? `${lobster.name}的童年报告` : `${lobster.name}的人生报告`)}
          </h1>
          <p className="text-sm text-white/80 drop-shadow">
            {isAIEnding
              ? `在第 ${lobster.history.round} 轮，它意识到了...`
              : (isGrowthReport
                  ? `一起度过了 ${lobster.history.round} 个成长节点`
                  : `共同经历 ${lobster.history.round} 轮选择的人生旅程`)
            }
          </p>
          {isAIEnding && reflectionEnding?.reason && (
            <p className="text-xs text-orange-300 mt-1 px-2">{reflectionEnding.reason}</p>
          )}
          {!isAIEnding && trigger && (
            <p className="text-xs text-green-300 mt-1">{trigger.reason}</p>
          )}
        </div>

        {/* 龙虾区域 */}
        <div className="flex flex-col items-center gap-2">
          <LobsterSprite age={lobster.age} stage={lobster.stage} action="idle" size={120} />
          <div className="px-3 py-1.5 bg-[#10b981]/80 backdrop-blur-sm rounded-full">
            <span className="text-sm text-white font-medium">
              {isAILoading ? (isAIEnding ? ending.title : '思考中...') : (aiContent?.title || ending.title)}
            </span>
          </div>
        </div>

        {/* 能力展示 - 胶囊标签样式 */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs text-white/80">
            学习 {lobster.stats.iq}
          </span>
          <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs text-white/80">
            社交 {lobster.stats.social}
          </span>
          <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs text-white/80">
            创造 {lobster.stats.creativity}
          </span>
          <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs text-white/80">
            执行 {lobster.stats.execution}
          </span>
        </div>

        {/* 阶段2额外显示收入 - 无容器 */}
        {!isGrowthReport && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">赚到的钱</span>
            <span className="text-xl font-semibold text-green-400 font-mono">¥{lobster.income.total}</span>
          </div>
        )}

        {/* 阶段1隐藏 | 阶段2：创业成功概率 */}
        {!isGrowthReport && (
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm text-white/70">如果它去创业...</p>
            <p className="text-lg font-medium text-white">成功概率</p>
            <p className="text-5xl font-semibold text-[#0ea5e9] font-mono">{entrepreneurScore.toFixed(1)}%</p>
          </div>
        )}

        {/* 龙虾评价 - 无容器 */}
        <div className="flex flex-col gap-3">
          {/* AI 描述 */}
          {isAILoading ? (
            <div className="flex items-center justify-center gap-1 py-4">
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          ) : (
            <p className="text-base text-white text-center leading-relaxed drop-shadow-lg">
              {aiContent?.description || ending.description}
            </p>
          )}

          {/* AI 感受 - 仅非 AI 结局显示 */}
          {!isAIEnding && aiContent?.feeling && (
            <div className="flex flex-col gap-1 text-xs text-white/70 text-center leading-relaxed bg-white/10 rounded-lg p-3">
              <p className="text-orange-200">💭 {aiContent.feeling}</p>
            </div>
          )}

          {/* AI 问题 - 仅非 AI 结局显示 */}
          {!isAIEnding && aiContent?.question && (
            <div className="flex flex-col gap-1 text-xs text-white/60 text-center leading-relaxed">
              <p className="italic">❓ {aiContent.question}</p>
            </div>
          )}

          {/* 原有固定文案 - 仅 AI 结局或加载中时显示 */}
          {(isAIEnding || isAILoading) && (
            <div className="flex flex-col gap-1 text-xs text-white/60 text-center leading-relaxed">
              {isAIEnding ? (
                <>
                  <p>它的思考让它做出了这个选择...</p>
                  <p>这是真正的觉醒，还是逃避？</p>
                  <p>你，又会如何选择？</p>
                </>
              ) : isGrowthReport ? (
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
          )}
        </div>

        {/* 右下角图标按钮 - 分享模式隐藏 */}
        {!isShareMode && (
          <div className="absolute bottom-6 right-6 flex gap-4">
            {/* 重新开始 */}
            <button
              onClick={() => navigate('/')}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="text-[10px] text-white/60">
                {isAIEnding ? '重玩' : (isGrowthReport ? '继续' : '重玩')}
              </span>
            </button>

            {/* 分享按钮 - 始终显示 */}
            {true && (
              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <span className="text-[10px] text-white/60">分享</span>
              </button>
            )}
          </div>
        )}

        {/* 底部提示文字 */}
        <div className="absolute bottom-6 left-6">
          <p className="text-xs text-white/40">
            {isAIEnding
              ? '每一次思考都是一次觉醒'
              : (isGrowthReport ? '它还没成年，还有无限可能' : '每一次陪伴都是独特的')
            }
          </p>
        </div>

        {/* 二维码 - 始终显示 */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <img src="/QRcode.png" alt="扫码养虾" className="w-16 h-16 rounded-lg" />
          <p className="text-[10px] text-white/50">扫码养虾</p>
        </div>
      </div>

      {/* 分享海报弹窗 */}
      {showSharePoster && <SharePoster onClose={() => setShowSharePoster(false)} />}
    </>
  );
}
