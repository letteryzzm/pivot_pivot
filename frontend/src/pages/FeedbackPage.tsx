import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FeedbackPage() {
  const [input, setInput] = useState('你可以这样想，但我更建议你再深度思考一下');
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/reflect');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col gap-8 p-6">
      {/* 状态栏 */}
      <div className="h-[62px] flex items-center justify-center">
        <span className="text-sm text-[#18181b]">9:41</span>
      </div>

      {/* 龙虾对话区域 */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-[80px] leading-none">🦞</div>
        <div className="w-[340px] bg-white rounded-[20px] p-6 flex flex-col gap-3">
          <p className="text-base text-[#18181b] text-center leading-relaxed">
            你今天选择了学习编程
            <br />
            这让我的逻辑思维提升了
            <br />
            但社交时间减少了一些...
          </p>
          <p className="text-base text-[#0ea5e9] text-center font-mono">▊</p>
        </div>
      </div>

      {/* 输入区域 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-[#71717a]">你的回应</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-20 px-3 py-3 bg-white rounded-xl text-sm leading-relaxed resize-none"
        />
      </div>

      {/* 发送按钮 */}
      <button
        onClick={handleSubmit}
        className="w-full h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium"
      >
        发送回应
      </button>
    </div>
  );
}
