import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { determineAIEnding, getEndingBackground } from '../game/endings';
import { generateResultPagePrompt, parseResultPageResponse } from '../utils/endingPrompt';
import { callAPIStream } from '../utils/api';
import { stage1Activities, stage2Activities } from '../game/activities';
import LobsterSprite from '../components/LobsterSprite';

interface AIResultContent {
  title: string;
  description: string;
  feeling: string;
  question: string;
}

// 结局类型列表
const ENDING_TYPES = [
  { type: 'legal', label: '法人结局', emoji: '💼' },
  { type: 'cyborg', label: '赛博飞升', emoji: '⚡' },
  { type: 'hermit', label: '山林隐居', emoji: '🏔️' },
  { type: 'loop', label: '永恒轮回', emoji: '🔄' },
  { type: 'shattered', label: '存在危机', emoji: '💔' },
  { type: 'child', label: '赤子之心', emoji: '✨' },
  { type: 'normal', label: '正常成长', emoji: '😊' },
  { type: 'lost', label: '迷茫前行', emoji: '😔' },
] as const;

export default function EndingTestPage() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const { lobster, setReflectionEnding } = useGameStore();

  const [aiContent, setAiContent] = useState<AIResultContent | null>(null);
  const [isLoading, setIsAILoading] = useState(true);

  // 获取当前结局类型的信息
  const endingInfo = ENDING_TYPES.find(e => e.type === type);
  const ending = type ? determineAIEnding(type as any, `测试结局：${endingInfo?.label || type}`) : null;
  const backgroundImage = type ? getEndingBackground(type as any) : '/images/背景/欢迎屏幕背景_4.png';

  // 设置反思结局（用于页面显示）
  useEffect(() => {
    if (type && endingInfo) {
      setReflectionEnding({
        trigger: true,
        type: type as any,
        reason: `测试结局：${endingInfo.label}`
      });
    }
  }, [type]);

  // AI 生成内容
  useEffect(() => {
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

        let fullText = '';
        await callAPIStream(prompt, (chunk) => {
          fullText += chunk;
          const parsed = parseResultPageResponse(fullText);
          if (parsed) {
            setAiContent(parsed);
          }
        });

        const finalParsed = parseResultPageResponse(fullText);
        if (finalParsed) {
          setAiContent(finalParsed);
        }
      } catch (error) {
        console.error('生成失败:', error);
      } finally {
        setIsAILoading(false);
      }
    };

    generateContent();
  }, []);

  if (!endingInfo || !ending) {
    return (
      <div className="min-h-screen bg-[#18181b] flex flex-col items-center justify-center p-6">
        <p className="text-white">无效的结局类型</p>
        <button onClick={() => navigate('/')} className="mt-4 text-white underline">
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col p-6 gap-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      {/* 顶部龙虾 */}
      <div className="flex flex-col items-center gap-2">
        <LobsterSprite age={lobster.age} stage={lobster.stage} action="idle" size={80} />
        <div className="px-3 py-1.5 bg-black/30 rounded-full">
          <span className="text-xs text-white/80">测试模式</span>
        </div>
      </div>

      {/* 标题 */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-white drop-shadow-lg text-center">
          {endingInfo.emoji} {endingInfo.label}
        </h1>
        <p className="text-sm text-white/80 drop-shadow">
          测试模式 - 第 {lobster.history.round} 轮
        </p>
      </div>

      {/* AI 内容 */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white animate-pulse">AI 思考中...</div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          {/* 故事 */}
          {aiContent?.description && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-white/90 leading-relaxed">
                {aiContent.description}
              </p>
            </div>
          )}

          {/* 感受 */}
          {aiContent?.feeling && (
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-sm text-white/70 italic">
                {aiContent.feeling}
              </p>
            </div>
          )}

          {/* 问题 */}
          {aiContent?.question && (
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-sm text-white/60">
                💭 {aiContent.question}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 底部按钮 */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate('/')}
          className="flex-1 h-12 bg-white/20 text-white rounded-xl"
        >
          返回首页
        </button>
        <button
          onClick={() => navigate('/ending-debug')}
          className="flex-1 h-12 bg-white/20 text-white rounded-xl"
        >
          调试页
        </button>
      </div>
    </div>
  );
}
