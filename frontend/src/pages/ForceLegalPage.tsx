import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import LobsterSprite from '../components/LobsterSprite';

export default function ForceLegalPage() {
  const navigate = useNavigate();
  const { nextStage, lobster } = useGameStore();

  const handleAccept = () => {
    nextStage(); // 强制进入阶段2，age 变为 6
    // 强制进入阶段2后，直接跳转到阶段2的活动选择页
    navigate('/select');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center gap-8 p-6"
      style={{ backgroundImage: "url('/images/背景/法人申请页.png')" }}
    >
      <p className="text-sm text-white/60">{lobster.stage === 1 ? "婴儿期" : "商务期"}</p>

      <div className="w-40 h-40 flex items-center justify-center">
        <LobsterSprite age={lobster.age} stage={lobster.stage} action="idle" size={140} />
      </div>

      <div className="w-[340px] bg-white rounded-[20px] p-6 flex flex-col gap-4">
        <p className="text-base text-[#18181b] text-center leading-relaxed">
          终于到了这一天...
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
          className="w-full h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium drop-shadow-lg hover:drop-shadow-xl transition-all"
        >
          接受现实
        </button>
        <p className="text-xs text-white/40 text-center">有些事情，时间到了就必须面对</p>
      </div>
    </div>
  );
}
