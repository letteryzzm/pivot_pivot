import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

export default function ForceLegalPage() {
  const navigate = useNavigate();
  const { nextStage } = useGameStore();

  const handleAccept = () => {
    nextStage(); // 强制进入阶段2
    navigate('/select');
  };

  return (
    <div className="min-h-screen bg-[#18181b] flex flex-col items-center justify-center gap-8 p-6">
      <p className="text-sm text-white/60">24岁</p>

      <div className="text-[120px] leading-none">🦞</div>

      <div className="w-[340px] bg-white rounded-[20px] p-6 flex flex-col gap-4">
        <p className="text-base text-[#18181b] text-center leading-relaxed">
          我24岁了...
        </p>
        <p className="text-base text-[#18181b] text-center leading-relaxed">
          按照规定，我必须成为法人
        </p>
        <p className="text-base text-[#18181b] text-center leading-relaxed">
          为自己的行为负责
        </p>
        <div className="w-full h-px bg-[#e5e7eb]"></div>
        <p className="text-sm text-[#71717a] text-center leading-relaxed">
          虽然有点突然，但...
          <br />
          这就是成长吧 (´･ω･`)
        </p>
      </div>

      <div className="flex flex-col gap-2 w-[340px]">
        <button
          onClick={handleAccept}
          className="w-full h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium"
        >
          接受现实
        </button>
        <p className="text-xs text-white/40 text-center">有些事情，时间到了就必须面对</p>
      </div>
    </div>
  );
}
