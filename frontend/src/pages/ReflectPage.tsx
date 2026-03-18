import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { callAPI } from '../utils/api';
import { getRandomReflection } from '../game/feedbackTemplates';
import LobsterSprite from '../components/LobsterSprite';

export default function ReflectPage() {
  const navigate = useNavigate();
  const { lobster, currentFeedback, userResponse, checkLegalBreak, checkForceLegal, updateConversationWithReflection } = useGameStore();
  const [reflection, setReflection] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 确保有反馈数据才生成反思
    if (!currentFeedback?.feedback) {
      console.log('反思页：没有反馈数据，使用默认文本');
      setReflection('我了解了，我再想想... (´･ω･`)');
      setIsLoading(false);
      return;
    }

    // 生成龙虾的二次反思
    const generateReflection = async () => {
      try {
        console.log('=== 反思页开始生成 ===');
        console.log('龙虾反馈:', currentFeedback.feedback);
        console.log('用户回应:', userResponse);

        // 混合模式：20%概率调用API，80%使用预设模板
        const useAI = Math.random() < 0.2;
        console.log('使用AI:', useAI);

        let reflectionText: string;

        if (useAI) {
          const prompt = `你是${lobster.name}，${lobster.age}岁。

【核心人设】
- 你是一个"人"，不是动物，只是用龙虾作为虚拟形象
- 你喜欢反思，经常质疑和思考
- 你喜欢反驳，不会完全顺从
- 你喜欢用颜文字：(｡･ω･｡) (´･ω･\`) (｡•́︿•̀｡) (๑•̀ㅂ•́)و
- 你有自己的想法，不是工具

刚才的对话：
你说：${currentFeedback.feedback}
玩家说：${userResponse || '你可以这样想，但我更建议你再深度思考一下'}

现在请表达你的二次反思：
- 你对玩家回应的看法
- 可以反驳、质疑、或继续思考
- 不要轻易认同

要求：
- 不超过40字
- 带1-2个颜文字
- 体现"喜欢反思、喜欢反驳"的人设
- 不要说"我会努力" "我明白了"等顺从的话`;

          console.log('========== 反思页完整Prompt ==========');
          console.log(prompt);
          console.log('====================================');

          const response = await callAPI(prompt);
          console.log('反思页API响应:', response);
          reflectionText = response.trim();
        } else {
          // 使用预设模板
          reflectionText = getRandomReflection();
          console.log('使用预设反思模板:', reflectionText);
        }

        console.log('最终反思文本:', reflectionText);
        setReflection(reflectionText);

        // 保存到对话历史
        updateConversationWithReflection(reflectionText);
      } catch (error) {
        console.error('反思生成失败:', error);
        const fallbackText = getRandomReflection();
        setReflection(fallbackText);
      } finally {
        setIsLoading(false);
      }
    };

    generateReflection();
  }, [currentFeedback, lobster.name, lobster.age, userResponse, updateConversationWithReflection]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <LobsterSprite age={lobster.age} action="idle" size={80} />
          <p className="mt-4 text-sm text-[#71717a]">{lobster.name}想了想...</p>
        </div>
      </div>
    );
  }

  const getBottomHint = () => {
    const round = lobster.history.round;
    if (round < 3) return '你们还有很长的路要走';
    if (round < 6) return '时间过得真快...';
    return '快要到重要的时刻了';
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col gap-8 p-6">
      <div className="h-[62px] flex items-center justify-center">
        <span className="text-sm text-[#18181b]">9:41</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-[#71717a]">{lobster.name}想了想...</p>
        <LobsterSprite age={lobster.age} action="idle" size={80} />
        <div className="w-[340px] bg-white rounded-[20px] p-6">
          <p className="text-base text-[#18181b] text-center leading-relaxed whitespace-pre-line">
            {reflection}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
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
          继续陪伴
        </button>
        <p className="text-xs text-[#71717a] text-center">{getBottomHint()}</p>
      </div>
    </div>
  );
}
