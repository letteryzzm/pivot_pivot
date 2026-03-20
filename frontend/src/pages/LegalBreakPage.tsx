import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import LobsterSprite from '../components/LobsterSprite';

export default function LegalBreakPage() {
  const navigate = useNavigate();
  const { nextStage, dismissLegalBreak, lobster } = useGameStore();

  const handleAgree = () => {
    const fromAge = lobster.age;
    nextStage(); // 进入阶段2，age 变为 6
    const toAge = 6;
    dismissLegalBreak();
    // 主动申请进入阶段2后，直接跳转到过渡页面
    navigate('/transition', { state: { fromAge, toAge } });
  };

  const handleThink = () => {
    dismissLegalBreak();
    navigate('/select'); // 继续成长期
  };

  return (
    <div className="min-h-screen bg-[#18181b] flex flex-col items-center justify-center gap-8 p-6">
      <p className="text-sm text-white/60">一个重要的决定</p>
      <div className="w-40 h-40 flex items-center justify-center">
        <LobsterSprite age={lobster.age} action="idle" size={140} />
      </div>
      <div className="w-[340px] bg-white rounded-[20px] p-6 flex flex-col gap-3">
        <p className="text-base text-[#18181b] text-center leading-relaxed">
          我想和你说件事...
        </p>
        <p className="text-base text-[#18181b] text-center leading-relaxed">
          我想当法人，有自己的银行账户
        </p>
        <p className="text-base text-[#18181b] text-center leading-relaxed">
          我想赚钱...帮你，也帮我自己
        </p>
        <p className="text-base text-[#18181b] text-center leading-relaxed">
          你愿意吗？
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleAgree}
          className="w-40 h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium"
        >
          好，我支持你
        </button>
        <button
          onClick={handleThink}
          className="w-[140px] h-12 bg-transparent border border-white text-white rounded-xl text-base font-medium"
        >
          再想想，不着急
        </button>
      </div>
      <p className="text-xs text-white/40">这是它自己的决定 · 不是你安排的</p>
    </div>
  );
}
