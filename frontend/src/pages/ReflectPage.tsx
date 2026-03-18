import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { callAPI } from '../utils/api';

export default function ReflectPage() {
  const navigate = useNavigate();
  const { lobster, currentFeedback, checkLegalBreak, checkForceLegal } = useGameStore();
  const [reflection, setReflection] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 生成龙虾的二次反思
    const generateReflection = async () => {
      try {
        const prompt = `你是${lobster.name}，刚才玩家回应了你的感受。

你之前说：${currentFeedback?.feedback}
玩家回应：你可以这样想，但我更建议你再深度思考一下

现在表达你的最终想法（不超过40字，带颜文字）：`;

        const response = await callAPI(prompt);
        setReflection(response.trim());
      } catch (error) {
        setReflection('我了解了，我再想想... (´･ω･`)');
      } finally {
        setIsLoading(false);
      }
    };

    generateReflection();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-[80px] leading-none animate-pulse">🦞</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col gap-8 p-6">
      <div className="h-[62px] flex items-center justify-center">
        <span className="text-sm text-[#18181b]">9:41</span>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="text-[80px] leading-none">🦞</div>
        <div className="w-[340px] bg-white rounded-[20px] p-6">
          <p className="text-base text-[#18181b] text-center leading-relaxed whitespace-pre-line">
            {reflection}
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          // 优先检查24岁强制法人
          if (checkForceLegal()) {
            navigate('/force-legal');
            return;
          }

          // 检查是否应该触发法人突破
          const shouldBreak = checkLegalBreak();
          if (shouldBreak) {
            navigate('/legal-break');
          } else {
            navigate('/select');
          }
        }}
        className="w-full h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium"
      >
        继续
      </button>
    </div>
  );
}
