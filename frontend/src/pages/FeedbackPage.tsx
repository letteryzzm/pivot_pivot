import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getActivityImagePathById } from '../config/activityImages';
import LobsterSprite from '../components/LobsterSprite';
import TypewriterText from '../components/TypewriterText';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lobster, currentFeedback, currentBackgroundImage, isLoading, setUserResponse, executeActivity } = useGameStore();
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

  // 从 store 读取背景图片
  useEffect(() => {
    // 使用 AI 返回的 backgroundImage，如果没有则使用默认值 1
    const imageId = currentBackgroundImage || 1;
    const imagePath = getActivityImagePathById(imageId);
    setBackground(imagePath);
  }, [currentBackgroundImage]);

  // 执行活动
  useEffect(() => {
    const activity = location.state?.activity;
    if (activity) {
      console.log('反馈页：收到活动', activity);
      executeActivity(activity);
    } else {
      console.warn('反馈页：没有活动数据，返回选择页');
      navigate('/select');
    }
  }, [location.state]);

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
        <div className="w-[340px] bg-white rounded-[20px] p-6 flex flex-col gap-3">
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

      <div className="flex flex-col gap-2">
        <label className="text-sm text-[#71717a]">你想对它说什么？</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="w-full h-20 px-3 py-3 bg-white rounded-xl text-sm leading-relaxed resize-none placeholder:text-gray-400"
        />
        <p className="text-xs text-[#71717a]">它会思考你的话</p>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium"
      >
        发送回应
      </button>
    </div>
  );
}
