import { useNavigate } from 'react-router-dom';

export default function TransitionPage() {
  const navigate = useNavigate();

  // 自动跳转到下一页
  setTimeout(() => {
    navigate('/game');
  }, 3000);

  return (
    <div className="min-h-screen bg-[#18181b] flex flex-col items-center justify-center gap-8 p-6">
      <p className="text-5xl text-white font-semibold font-mono text-center">第 12 天</p>
      <div className="text-[80px] leading-none">🦞</div>
      <div className="w-[320px] bg-white rounded-2xl p-5">
        <p className="text-base text-[#18181b] text-center leading-relaxed">
          今天学了好多东西...
          <br />
          感觉脑子有点累 (´･ω･`)
        </p>
      </div>
      <p className="text-sm text-[#71717a] text-center">时间在流逝...</p>
    </div>
  );
}
