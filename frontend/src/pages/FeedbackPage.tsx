import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getActivityImagePathById } from '../config/activityImages';
import LobsterSprite from '../components/LobsterSprite';
import TypewriterText from '../components/TypewriterText';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lobster, currentFeedback, feedbackBackgroundImage, isLoading, setUserResponse } = useGameStore();
  const [input, setInput] = useState('');
  const [background, setBackground] = useState('');

  const placeholders = [
    '你可以这样想，但我更建议你再深度思考一下',
    '嗯...我听到了，但你确定吗？',
    '或许换个角度想想？',
    '我理解，不过...',
    '真的是这样吗？'
  ];
  const [placeholder] = useState(() => placeholders[Math.floor(Math.random() * placeholders.length)]);

  // 从 store 读取背景图片（反馈页使用 feedbackBackgroundImage）
  useEffect(() => {
    const imageId = feedbackBackgroundImage || 1;
    const imagePath = getActivityImagePathById(imageId);
    setBackground(imagePath);
  }, [feedbackBackgroundImage]);

  // 如果没有活动数据（直接访问页面），返回选择页
  useEffect(() => {
    const activity = location.state?.activity;
    if (!activity) {
      navigate('/select');
    }
  }, [location.state, navigate]);

  const handleSubmit = () => {
    const response = input.trim() || placeholder;
    setUserResponse(response);
    navigate('/reflect');
  };

  return (
    <div
      className="min-h-screen flex flex-col gap-8 p-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: background ? `url('${background}')` : undefined }}
    >
      <div className="h-[62px]"></div>

      <div className="flex flex-col items-center gap-4">
        <LobsterSprite age={lobster.age} action="idle" size={80} />
        <div className="w-full px-6">
          <div className="bg-white/25 -skew-x-6 p-6 flex flex-col gap-3 drop-shadow-xl">
            <TypewriterText
              text={isLoading ? '' : (currentFeedback?.feedback || '')}
              speed={55}
              className="text-base text-[#18181b] text-center leading-relaxed block"
            />
            <p className="text-sm text-[#71717a] text-center">
              执行程度: {currentFeedback?.execution || 0}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-6">
        <label className="text-sm text-[#71717a] -skew-x-6">你想对它说什么？</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="w-full h-20 bg-white/25 -skew-x-6 rounded-sm px-4 py-3 text-base leading-relaxed resize-none placeholder:text-gray-400 border border-white/20 focus:outline-none focus:bg-white/40 focus:border-[#0ea5e9] transition-colors drop-shadow-lg"
        />
        <p className="text-xs text-[#71717a] -skew-x-6">它会思考你的话</p>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3 text-base font-medium text-[#18181b] drop-shadow-lg hover:drop-shadow-xl transition-all"
      >
        发送回应 →
      </button>
    </div>
  );
}
