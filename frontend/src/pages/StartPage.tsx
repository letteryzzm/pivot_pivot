import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import LobsterSprite from '../components/LobsterSprite';

export default function StartPage() {
  const [name, setName] = useState('');
  const startGame = useGameStore((state) => state.startGame);
  const navigate = useNavigate();

  const handleStart = () => {
    if (name.trim()) {
      startGame(name);
      navigate('/game');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/背景/欢迎屏幕背景_2.png')" }}
    >
      {/* 状态栏 */}
      <div className="h-[62px] flex items-center justify-center">
        <span className="text-sm text-[#18181b]">9:41</span>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 flex flex-col gap-6 px-4">
        {/* 标题区域 */}
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-2xl font-semibold text-[#18181b] text-center">一只🦐的使命</h1>
          <p className="text-sm text-[#71717a] text-center">模型成人之路，需要人的陪伴</p>
        </div>

        {/* 龙虾区域 */}
        <div className="h-[120px] flex items-center justify-center">
          <LobsterSprite age={0} action="idle" size={100} />
        </div>

        {/* 剧情文本 */}
        <div className="flex flex-col gap-1 items-center text-center">
          <p className="text-sm text-[#52525b]">这是一只刚出生的龙虾</p>
          <p className="text-sm text-[#52525b]">它的大脑结构已经长好了</p>
          <p className="text-sm text-[#52525b]">但还不知道怎么使用</p>
          <p className="text-sm text-[#52525b]">它需要你的陪伴，才能成长</p>
        </div>

        {/* 输入区域 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-[#18181b]">给它取个名字</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-12 px-3 bg-white rounded-xl text-base"
            placeholder='比如"小克劳德"'
          />
        </div>

        {/* 开始按钮 */}
        <button
          onClick={handleStart}
          className="w-full h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium"
        >
          开始陪伴
        </button>

        {/* 提示文字 */}
        <p className="text-xs text-[#71717a] text-center">这不是速成游戏 · 成长需要真实的时间</p>
      </div>
    </div>
  );
}
