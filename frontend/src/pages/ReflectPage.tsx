import { useNavigate } from 'react-router-dom';

export default function ReflectPage() {
  const navigate = useNavigate();

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
            我了解了
            <br />
            我再想想...
            <br />
            <br />
            也许我应该平衡一下
            <br />
            不能只顾一方面
          </p>
          <p className="text-xl text-[#71717a] text-center">(´･ω･`)</p>
        </div>
      </div>

      {/* 继续按钮 */}
      <button
        onClick={() => navigate('/game')}
        className="w-full h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium"
      >
        继续
      </button>
    </div>
  );
}
