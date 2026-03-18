import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import LobsterSprite from '../components/LobsterSprite';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const { lobster, currentFeedback, isLoading, setUserResponse } = useGameStore();
  const [input, setInput] = useState('你可以这样想，但我更建议你再深度思考一下');

  const handleSubmit = () => {
    setUserResponse(input);
    navigate('/reflect');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <LobsterSprite age={lobster.age} action="idle" size={80} />
          <p className="mt-4 text-sm text-[#71717a]">龙虾正在思考...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col gap-8 p-6">
      <div className="h-[62px] flex items-center justify-center">
        <span className="text-sm text-[#18181b]">9:41</span>
      </div>

      <div className="flex flex-col items-center gap-4">
        <LobsterSprite age={lobster.age} action="idle" size={80} />
        <div className="w-[340px] bg-white rounded-[20px] p-6 flex flex-col gap-3">
          <p className="text-base text-[#18181b] text-center leading-relaxed">
            {currentFeedback?.feedback || '我完成了活动...'}
          </p>
          <p className="text-sm text-[#71717a] text-center">
            执行程度: {currentFeedback?.execution || 0}%
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-[#71717a]">你的回应</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-20 px-3 py-3 bg-white rounded-xl text-sm leading-relaxed resize-none"
        />
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
