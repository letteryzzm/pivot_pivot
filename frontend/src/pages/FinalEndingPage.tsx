import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { callAPIStream } from '../utils/api';
import { generateEndingPrompt, parseEndingResponse, getFallbackEnding } from '../utils/endingPrompt';
import { stage1Activities, stage2Activities } from '../game/activities';
import LobsterSprite from '../components/LobsterSprite';
import TypewriterText from '../components/TypewriterText';

interface EndingContent {
  title: string;
  story: string;
  feeling: string;
  question: string;
  endingImage: string;
}

export default function FinalEndingPage() {
  const navigate = useNavigate();
  const { lobster } = useGameStore();

  const [ending, setEnding] = useState<EndingContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<'title' | 'story' | 'feeling' | 'question' | 'image'>('title');

  useEffect(() => {
    const generateEnding = async () => {
      try {
        const prompt = generateEndingPrompt({
          lobster,
          stage1Activities,
          stage2Activities,
        });

        console.log('========== 结局页Prompt ==========');
        console.log(prompt);
        console.log('=================================');

        let fullText = '';
        await callAPIStream(prompt, (chunk) => {
          fullText += chunk;
          const parsed = parseEndingResponse(fullText);
          if (parsed) {
            // 按顺序显示各部分
            if (parsed.title && parsed.title !== ending?.title) {
              setEnding(prev => prev ? { ...prev, title: parsed.title } : parsed);
              setCurrentSection('story');
            }
          }
        });

        const finalParsed = parseEndingResponse(fullText);
        if (finalParsed) {
          setEnding(finalParsed);
        } else {
          setEnding(getFallbackEnding(lobster));
        }
      } catch (error) {
        console.error('生成结局失败:', error);
        setEnding(getFallbackEnding(lobster));
      } finally {
        setIsLoading(false);
      }
    };

    generateEnding();
  }, [lobster]);

  // 打字机动画的各部分
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedStory, setDisplayedStory] = useState('');
  const [displayedFeeling, setDisplayedFeeling] = useState('');
  const [displayedQuestion, setDisplayedQuestion] = useState('');
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (!ending) return;

    let current = '';

    // 标题打字效果
    const titleInterval = setInterval(() => {
      if (current.length < ending.title.length) {
        current = ending.title.slice(0, current.length + 1);
        setDisplayedTitle(current);
      } else {
        clearInterval(titleInterval);
        // 标题完成后开始故事
        setTimeout(() => setCurrentSection('story'), 500);
      }
    }, 150);

    return () => clearInterval(titleInterval);
  }, [ending?.title]);

  useEffect(() => {
    if (currentSection !== 'story' || !ending) return;

    let current = '';
    const interval = setInterval(() => {
      if (current.length < ending.story.length) {
        current = ending.story.slice(0, current.length + 1);
        setDisplayedStory(current);
      } else {
        clearInterval(interval);
        setTimeout(() => setCurrentSection('feeling'), 800);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentSection, ending?.story]);

  useEffect(() => {
    if (currentSection !== 'feeling' || !ending) return;

    let current = '';
    const interval = setInterval(() => {
      if (current.length < ending.feeling.length) {
        current = ending.feeling.slice(0, current.length + 1);
        setDisplayedFeeling(current);
      } else {
        clearInterval(interval);
        setTimeout(() => setCurrentSection('question'), 800);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentSection, ending?.feeling]);

  useEffect(() => {
    if (currentSection !== 'question' || !ending) return;

    let current = '';
    const interval = setInterval(() => {
      if (current.length < ending.question.length) {
        current = ending.question.slice(0, current.length + 1);
        setDisplayedQuestion(current);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowImage(true);
          setCurrentSection('image');
        }, 800);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentSection, ending?.question]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/背景/欢迎屏幕背景_4.png')" }}
      >
        <LobsterSprite age={lobster.age} stage={lobster.stage} action="idle" size={100} />
        <p className="text-sm text-white/80 animate-pulse">
          {lobster.name}正在回忆这一生...
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col p-6 gap-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/背景/欢迎屏幕背景_4.png')" }}
    >
      {/* 顶部龙虾 */}
      <div className="flex flex-col items-center gap-2">
        <LobsterSprite age={lobster.age} stage={lobster.stage} action="idle" size={80} />
        <div className="px-3 py-1.5 bg-black/30 rounded-full">
          <span className="text-xs text-white/80">{lobster.stage === 1 ? "婴儿期" : "商务期"}</span>
        </div>
      </div>

      {/* 标题 */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-white">
          {displayedTitle}
          <span className="animate-pulse">|</span>
        </h1>
      </div>

      {/* 故事 */}
      <div className="bg-white/90 rounded-2xl p-5">
        <TypewriterText
          text={displayedStory}
          speed={30}
          className="text-sm text-[#18181b] leading-relaxed whitespace-pre-line"
        />
      </div>

      {/* 感受 */}
      <div className="bg-white/90 rounded-2xl p-5">
        <p className="text-xs text-[#71717a] mb-2">它对你说：</p>
        <TypewriterText
          text={displayedFeeling}
          speed={30}
          className="text-sm text-[#18181b] leading-relaxed italic"
        />
      </div>

      {/* 问题 */}
      <div className="bg-[#fef3c7] rounded-2xl p-5 border-2 border-[#f59e0b]/30">
        <p className="text-xs text-[#b45309] mb-2">💭 留给你思考：</p>
        <TypewriterText
          text={displayedQuestion}
          speed={30}
          className="text-base text-[#92400e] font-medium leading-relaxed"
        />
      </div>

      {/* 结尾意象 */}
      {showImage && ending && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 animate-fade-in">
          <p className="text-xs text-white/60">—— {ending.endingImage} ——</p>
        </div>
      )}

      {/* 底部按钮 */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => navigate('/share-preview')}
          className="w-full h-12 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white rounded-xl text-base font-medium"
        >
          分享这段故事
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full h-12 bg-white/20 text-white rounded-xl text-base font-medium"
        >
          重新开始
        </button>
        <p className="text-xs text-white/50 text-center">
          每一段陪伴都是独特的 · 因为时间不会重来
        </p>
      </div>
    </div>
  );
}
