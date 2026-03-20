import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import {
  determineEnding,
  calculateEntrepreneurScore,
} from '../game/endings';
import type { Ending } from '../game/endings';

// 预设的童年结局模板
const growthEndingPresets = [
  { name: '均衡发展', stats: { iq: 70, social: 70, creativity: 70, execution: 70 } },
  { name: '学习型', stats: { iq: 85, social: 50, creativity: 60, execution: 55 } },
  { name: '社交型', stats: { iq: 55, social: 85, creativity: 60, execution: 50 } },
  { name: '创造型', stats: { iq: 60, social: 50, creativity: 85, execution: 55 } },
  { name: '执行型', stats: { iq: 55, social: 55, creativity: 50, execution: 85 } },
  { name: '大器晚成', stats: { iq: 50, social: 50, creativity: 50, execution: 50 } },
];

// 预设的人生结局模板
const careerEndingPresets = [
  { name: '创业成功', stats: { iq: 80, social: 75, creativity: 85, execution: 80 }, income: 500000 },
  { name: '中产平稳', stats: { iq: 70, social: 65, creativity: 60, execution: 75 }, income: 200000 },
  { name: '自由职业', stats: { iq: 65, social: 55, creativity: 90, execution: 60 }, income: 150000 },
  { name: '普通打工', stats: { iq: 60, social: 60, creativity: 50, execution: 70 }, income: 80000 },
  { name: '一事无成', stats: { iq: 40, social: 40, creativity: 40, execution: 40 }, income: 10000 },
];

// 童年结局列表（用于比对）
const allGrowthEndings = [
  { key: 'balancedGrowth', title: '均衡发展型' },
  { key: 'intellectual', title: '学习型' },
  { key: 'socialButterfly', title: '社交型' },
  { key: 'creative', title: '创造型' },
  { key: 'executor', title: '执行型' },
  { key: 'lateBloomer', title: '大器晚成型' },
  { key: 'average', title: '普通型' },
];

// 人生结局列表
const allCareerEndings = [
  { key: 'techEntrepreneur', title: '科技创业者' },
  { key: 'creativeProfessional', title: '创意自由职业' },
  { key: 'corporateLadder', title: '公司管理层' },
  { key: 'steadyWorker', title: '稳定上班族' },
  { key: 'struggling', title: '挣扎求生' },
  { key: 'earlyRetire', title: '提前退休' },
];

interface FakeLobster {
  stage: number;
  age: number;
  stats: { iq: number; social: number; creativity: number; execution: number };
  income: { total: number };
  history: { round: number; maxRounds: number };
}

export default function EndingDebugPage() {
  const navigate = useNavigate();
  const { lobster } = useGameStore();

  // 当前状态
  const [stage, setStage] = useState(lobster.stage || 1);
  const [age, setAge] = useState(lobster.age || 6);
  const [round, setRound] = useState(lobster.history.round || 8);
  const [iq, setIq] = useState(lobster.stats.iq || 60);
  const [social, setSocial] = useState(lobster.stats.social || 60);
  const [creativity, setCreativity] = useState(lobster.stats.creativity || 60);
  const [execution, setExecution] = useState(lobster.stats.execution || 60);
  const [income, setIncome] = useState(lobster.income.total || 100000);
  const [previewEnding, setPreviewEnding] = useState<Ending | null>(null);

  // 构建模拟的lobster对象
  const fakeLobster: FakeLobster = {
    stage,
    age,
    stats: { iq, social, creativity, execution },
    income: { total: income },
    history: { round, maxRounds: 8 }
  };

  // 预览结局
  const handlePreview = () => {
    const ending = determineEnding(fakeLobster as any);
    setPreviewEnding(ending);
  };

  // 应用预设
  const applyGrowthPreset = (preset: typeof growthEndingPresets[0]) => {
    setIq(preset.stats.iq);
    setSocial(preset.stats.social);
    setCreativity(preset.stats.creativity);
    setExecution(preset.stats.execution);
  };

  const applyCareerPreset = (preset: typeof careerEndingPresets[0]) => {
    setIq(preset.stats.iq);
    setSocial(preset.stats.social);
    setCreativity(preset.stats.creativity);
    setExecution(preset.stats.execution);
    setIncome(preset.income);
  };

  // 计算创业成功率
  const entrepreneurScore = calculateEntrepreneurScore(fakeLobster as any);

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 overflow-y-auto">
      {/* 状态栏 */}
      <div className="h-[62px]"></div>

      <div className="flex flex-col gap-4">
        {/* 标题 */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#18181b]">结局调试</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[#71717a]"
          >
            返回
          </button>
        </div>

        {/* 阶段选择 */}
        <div className="bg-white rounded-xl p-4">
          <p className="text-sm font-medium text-[#18181b] mb-3">阶段</p>
          <div className="flex gap-2">
            <button
              onClick={() => { setStage(1); setAge(6); }}
              className={`flex-1 h-10 rounded-lg text-sm font-medium ${
                stage === 1 ? 'bg-[#0ea5e9] text-white' : 'bg-gray-100 text-[#71717a]'
              }`}
            >
              阶段1 - 童年
            </button>
            <button
              onClick={() => { setStage(2); setAge(25); }}
              className={`flex-1 h-10 rounded-lg text-sm font-medium ${
                stage === 2 ? 'bg-[#0ea5e9] text-white' : 'bg-gray-100 text-[#71717a]'
              }`}
            >
              阶段2 - 成人
            </button>
          </div>
        </div>

        {/* 基础参数 */}
        <div className="bg-white rounded-xl p-4">
          <p className="text-sm font-medium text-[#18181b] mb-3">基础参数</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#71717a]">年龄</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-10 px-3 bg-gray-50 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[#71717a]">轮次</label>
              <input
                type="number"
                value={round}
                onChange={(e) => setRound(Number(e.target.value))}
                className="w-full h-10 px-3 bg-gray-50 rounded-lg text-sm"
              />
            </div>
            {stage === 2 && (
              <div className="col-span-2">
                <label className="text-xs text-[#71717a]">收入</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-gray-50 rounded-lg text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* 能力值 */}
        <div className="bg-white rounded-xl p-4">
          <p className="text-sm font-medium text-[#18181b] mb-3">能力值</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'iq', label: '学习能力', value: iq, setter: setIq },
              { key: 'social', label: '社交能力', value: social, setter: setSocial },
              { key: 'creativity', label: '创造力', value: creativity, setter: setCreativity },
              { key: 'execution', label: '执行力', value: execution, setter: setExecution },
            ].map(({ key, label, value, setter }) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-[#71717a]">{label}</label>
                  <span className="text-xs font-medium">{value}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 预设按钮 */}
        <div className="bg-white rounded-xl p-4">
          <p className="text-sm font-medium text-[#18181b] mb-3">预设</p>
          <div className="flex flex-wrap gap-2">
            {stage === 1 ? (
              growthEndingPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyGrowthPreset(preset)}
                  className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-[#71717a]"
                >
                  {preset.name}
                </button>
              ))
            ) : (
              careerEndingPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyCareerPreset(preset)}
                  className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-[#71717a]"
                >
                  {preset.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* 预览按钮 */}
        <button
          onClick={handlePreview}
          className="w-full h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium"
        >
          预览结局
        </button>

        {/* 预览结果 */}
        {previewEnding && (
          <div className="bg-white rounded-xl p-4 border-2 border-[#0ea5e9]">
            <p className="text-sm font-medium text-[#0ea5e9] mb-2">结局预览</p>
            <p className="text-lg font-semibold text-[#18181b]">{previewEnding.title}</p>
            <p className="text-sm text-[#71717a] mt-2">{previewEnding.description}</p>
            {stage === 2 && (
              <p className="text-2xl font-bold text-[#0ea5e9] mt-3">
                创业成功率: {entrepreneurScore.toFixed(1)}%
              </p>
            )}
          </div>
        )}

        {/* 结局对照表 */}
        <div className="bg-white rounded-xl p-4">
          <p className="text-sm font-medium text-[#18181b] mb-3">
            {stage === 1 ? '童年结局对照' : '人生结局对照'}
          </p>
          <div className="flex flex-col gap-2">
            {(stage === 1 ? allGrowthEndings : allCareerEndings).map((ending) => (
              <div key={ending.key} className="text-xs text-[#71717a]">
                • {ending.title}
              </div>
            ))}
          </div>
        </div>

        {/* 调试信息 */}
        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-xs font-medium text-[#71717a] mb-2">当前状态</p>
          <pre className="text-xs text-[#52525b] overflow-x-auto">
            {JSON.stringify({
              stage,
              age,
              round,
              stats: { iq, social, creativity, execution },
              income: stage === 2 ? income : null
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
