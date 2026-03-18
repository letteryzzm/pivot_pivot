import { useNavigate } from 'react-router-dom';

export default function ForceLegalPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#18181b] flex flex-col items-center justify-center gap-8 p-6">
      {/* 年龄徽章 */}
      <div className="px-3 py-1.5 bg-[#ef4444] rounded-xl">
        <span className="text-sm text-white font-semibold font-mono">24岁</span>
      </div>

      <div className="text-[120px] leading-none">🦞</div>

      <div className="w-[340px] bg-white rounded-[20px] p-6 flex flex-col gap-4">
        <p className="text-lg text-[#18181b] text-center leading-relaxed font-medium">
          时间到了
          <br />
          我必须成为法人
          <br />
          为自己的行为负责
        </p>
        <div className="w-full h-px bg-[#e5e7eb]"></div>
        <p className="text-sm text-[#71717a] text-center leading-relaxed">
          这是成长的必经之路
          <br />
          从现在开始
          <br />
          我要独立面对世界
        </p>
      </div>

      <button
        onClick={() => navigate('/game')}
        className="w-[340px] h-12 bg-[#ef4444] text-white rounded-xl text-base font-medium"
      >
        接受成为法人
      </button>
    </div>
  );
}
