import { useNavigate } from 'react-router-dom';

export default function LegalBreakPage() {
  const navigate = useNavigate();

  const handleAgree = () => {
    navigate('/game');
  };

  const handleThink = () => {
    navigate('/reflect');
  };

  return (
    <div className="min-h-screen bg-[#18181b] flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-[120px] leading-none">🦞</div>
      <div className="w-[340px] bg-white rounded-[20px] p-6">
        <p className="text-lg text-[#18181b] text-center leading-relaxed font-medium">
          我想当法人
          <br />
          有自己的银行账户
          <br />
          赚钱帮你
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleAgree}
          className="w-40 h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium"
        >
          同意
        </button>
        <button
          onClick={handleThink}
          className="w-[140px] h-12 bg-transparent border border-white text-white rounded-xl text-base font-medium"
        >
          再想想
        </button>
      </div>
    </div>
  );
}
