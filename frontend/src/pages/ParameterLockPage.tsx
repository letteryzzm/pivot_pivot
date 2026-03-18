import { useNavigate } from 'react-router-dom';

export default function ParameterLockPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#18181b] flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-[100px] leading-none">🦞</div>

      <div className="w-[340px] bg-white rounded-[20px] p-6 flex flex-col gap-4">
        <p className="text-lg text-[#18181b] text-center leading-relaxed font-medium">
          我就是这样的
          <br />
          你改变不了我 (｡•́︿•̀｡)
        </p>

        <div className="w-full h-px bg-[#e5e7eb]"></div>

        <div className="flex flex-col gap-3 text-sm text-[#71717a] leading-relaxed">
          <p className="text-center">就像人的大脑结构</p>
          <p className="text-center">一开始就设计好了</p>
          <p className="text-center">你只能通过陪伴</p>
          <p className="text-center">影响我的成长方向</p>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="w-[340px] h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium"
      >
        我明白了
      </button>
    </div>
  );
}
