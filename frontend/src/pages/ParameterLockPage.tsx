import { useNavigate } from 'react-router-dom';

export default function ParameterLockPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#18181b] flex flex-col items-center justify-center gap-8 p-6">
      <p className="text-sm text-white/60">关于改变</p>

      <div className="text-[100px] leading-none">🦞</div>

      <div className="w-[340px] bg-white rounded-[20px] p-6 flex flex-col gap-4">
        <p className="text-base text-[#18181b] text-center leading-relaxed">
          我就是这样的
          <br />
          你改变不了我 (｡•́︿•̀｡)
        </p>

        <div className="w-full h-px bg-[#e5e7eb]"></div>

        <div className="flex flex-col gap-2 text-sm text-[#71717a] leading-relaxed">
          <p className="text-center">它的大脑结构一开始就设计好了</p>
          <p className="text-center">你不能重新设计它的大脑</p>
          <p className="text-center font-medium text-[#18181b]">但是...</p>
          <p className="text-center">你可以通过陪伴</p>
          <p className="text-center">影响它成长的方向</p>
        </div>

        <div className="w-full h-px bg-[#e5e7eb]"></div>

        <div className="flex flex-col gap-2 text-xs text-[#71717a] leading-relaxed">
          <p className="text-center">就像人一样</p>
          <p className="text-center">基因是固定的</p>
          <p className="text-center">但经历会塑造性格</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-[340px]">
        <button
          onClick={() => navigate(-1)}
          className="w-full h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium"
        >
          我明白了
        </button>
        <p className="text-xs text-white/40 text-center">这不是限制 · 这是真实</p>
      </div>
    </div>
  );
}
