import { useState, useEffect, useMemo } from 'react';

// 测试用阶段列表
const STAGES = ['婴儿', '青少年', '商务'] as const;
const ACTIONS = ['idle', 'walk', 'run'] as const;
const FRAMES = [1, 2] as const;
const KEYPOINTS = ['开始', '中间', '结束'] as const;

// 所有背景图
const BACKGROUNDS = [
  '/images/背景/欢迎屏幕背景_2.png',
  '/images/背景/欢迎屏幕背景_4.png',
  '/images/背景/学校和街区背景_1.png',
  '/images/背景/学校和街区背景_2.png',
  '/images/背景/学校和街区背景_3.png',
  '/images/背景/学校和街区背景_4.png',
  '/images/背景/图书馆场景_1.png',
  '/images/背景/图书馆场景_2.png',
  '/images/背景/图书馆场景_3.png',
  '/images/背景/图书馆场景_4.png',
  '/images/背景/虚拟工作空间_1.png',
  '/images/背景/虚拟工作空间_2.png',
  '/images/背景/虚拟工作空间_3.png',
  '/images/背景/虚拟工作空间_4.png',
];

// 关键点配置
interface Keypoint {
  x: number;
  y: number;
}

// 单个图片配置
interface ImageConfig {
  paramId: string;       // 参数ID，用于AI返回
  stage: string;         // 阶段
  action: string;        // 动作
  frame: number;         // 帧
  background: string;    // 背景
  keypoints: Keypoint[]; // 3个关键点
}

// 生成图片唯一ID
function getImageId(stage: string, action: string, frame: number, background: string): string {
  const bgName = background.split('/').pop()?.replace('.png', '') || background;
  return `${stage}_${action}${frame}_${bgName}`;
}

// 生成默认参数ID
function getDefaultParamId(stage: string, action: string, frame: number): string {
  return `${stage}_${action}_${frame}`;
}

export default function AnimationTestPage() {
  // 当前设置
  const [stage, setStage] = useState<typeof STAGES[number]>('婴儿');
  const [action, setAction] = useState<typeof ACTIONS[number]>('idle');
  const [frame, setFrame] = useState<typeof FRAMES[number]>(1);
  const [background, setBackground] = useState(BACKGROUNDS[2]);
  const [paramId, setParamId] = useState('');

  // 手动位置
  const [x, setX] = useState(50);
  const [y, setY] = useState(65);

  // 当前编辑的关键点索引 (0=开始, 1=中间, 2=结束)
  const [editKeypointIndex, setEditKeypointIndex] = useState<0 | 1 | 2>(0);

  // 保存的所有配置
  const [configs, setConfigs] = useState<Record<string, ImageConfig>>({});

  // 当前配置ID
  const currentId = useMemo(
    () => getImageId(stage, action, frame, background),
    [stage, action, frame, background]
  );

  // 当前图片配置
  const currentConfig = useMemo(
    () => configs[currentId] || {
      paramId: '',
      stage,
      action,
      frame,
      background,
      keypoints: [
        { x: 50, y: 65 },
        { x: 50, y: 65 },
        { x: 50, y: 65 },
      ],
    },
    [currentId, configs, stage, action, frame, background]
  );

  // 加载配置时同步 paramId
  useEffect(() => {
    const config = configs[currentId];
    if (config?.paramId) {
      setParamId(config.paramId);
    } else {
      setParamId(getDefaultParamId(stage, action, frame));
    }
  }, [currentId, configs, stage, action, frame]);

  // 加载当前关键点到编辑框
  useEffect(() => {
    const config = configs[currentId] || {
      keypoints: [
        { x: 50, y: 65 },
        { x: 50, y: 65 },
        { x: 50, y: 65 },
      ],
    };
    setX(config.keypoints[editKeypointIndex].x);
    setY(config.keypoints[editKeypointIndex].y);
  }, [currentId, editKeypointIndex, configs]);

  // 保存当前关键点
  const saveKeypoint = () => {
    const newConfigs = { ...configs };
    if (!newConfigs[currentId]) {
      newConfigs[currentId] = {
        paramId: paramId || getDefaultParamId(stage, action, frame),
        stage,
        action,
        frame,
        background,
        keypoints: [
          { x: 50, y: 65 },
          { x: 50, y: 65 },
          { x: 50, y: 65 },
        ],
      };
    }

    // 更新当前关键点
    newConfigs[currentId].keypoints[editKeypointIndex] = { x, y };
    newConfigs[currentId].paramId = paramId || getDefaultParamId(stage, action, frame);
    newConfigs[currentId].stage = stage;
    newConfigs[currentId].action = action;
    newConfigs[currentId].frame = frame;
    newConfigs[currentId].background = background;

    setConfigs(newConfigs);
  };

  // 导出配置
  const exportConfig = () => {
    console.log('// ====== 动画配置导出 ======');
    console.log('// 用于AI返回的 paramId 映射');
    console.log('const animationConfigs = {');

    // 按 paramId 分组导出（更方便AI使用）
    const byParamId: Record<string, ImageConfig> = {};
    Object.entries(configs).forEach(([_id, config]) => {
      const pid = config.paramId || getDefaultParamId(config.stage, config.action, config.frame);
      byParamId[pid] = config;
    });

    // 导出 paramId 映射表
    console.log('  // paramId 映射表 - AI返回此ID即可触发对应动画');
    Object.entries(byParamId).forEach(([paramId, config]) => {
      const bgName = config.background.split('/').pop()?.replace('.png', '') || '';
      console.log(`  '${paramId}': '${config.stage}_${config.action}${config.frame}_${bgName}',`);
    });

    console.log('');
    console.log('  // 完整配置');
    Object.entries(configs).forEach(([id, config]) => {
      console.log(`  '${id}': {`);
      console.log(`    paramId: '${config.paramId || getDefaultParamId(config.stage, config.action, config.frame)}',`);
      console.log(`    background: '${config.background}',`);
      console.log(`    keypoints: [`);
      config.keypoints.forEach((kp, i) => {
        console.log(`      { x: ${kp.x}, y: ${kp.y} }, // ${KEYPOINTS[i]}`);
      });
      console.log(`    ],`);
      console.log(`  },`);
    });

    console.log('};');
    console.log('// ==========');
    console.log('// AI返回示例: { animationId: "婴儿_walk_1" }');
  };

  // 获取图片路径
  const imagePath = useMemo(() => {
    const actionNameMap: Record<string, Record<string, string>> = {
      '婴儿': { idle: '待机', walk: '正面走', run: '奔跑' },
      '青少年': { idle: '待机', walk: '正面走', run: '奔跑' },
      '商务': { idle: '待机', walk: '正面走', run: '奔跑' },
    };
    const actionName = actionNameMap[stage]?.[action] || '待机';
    return `/images/claw/${stage}${actionName}${frame}.png`;
  }, [stage, action, frame]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* 背景图 */}
      <img
        src={background}
        alt="背景"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 状态栏占位 */}
      <div className="h-[62px]"></div>

      {/* 龙虾 */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${x}%`,
          top: `${y}%`,
        }}
      >
        <img
          src={imagePath}
          alt={`${stage}龙虾`}
          className="w-32 h-32 object-contain"
        />
      </div>

      {/* 控制面板 */}
      <div className="absolute top-20 right-4 w-72 bg-black/70 p-4 rounded-lg text-white space-y-3 max-h-[80vh] overflow-y-auto">
        <h3 className="font-bold text-sm">🎬 动画调试</h3>

        {/* 阶段选择 */}
        <div>
          <label className="text-xs text-gray-400">阶段</label>
          <div className="flex flex-wrap gap-1 mt-1">
            {STAGES.map(s => (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={`px-2 py-1 text-xs rounded ${
                  stage === s ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 动作选择 */}
        <div>
          <label className="text-xs text-gray-400">动作</label>
          <div className="flex gap-1 mt-1">
            {ACTIONS.map(a => (
              <button
                key={a}
                onClick={() => setAction(a)}
                className={`px-2 py-1 text-xs rounded ${
                  action === a ? 'bg-green-500' : 'bg-gray-700'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* 帧选择 */}
        <div>
          <label className="text-xs text-gray-400">帧</label>
          <div className="flex gap-1 mt-1">
            {FRAMES.map(f => (
              <button
                key={f}
                onClick={() => setFrame(f)}
                className={`px-2 py-1 text-xs rounded ${
                  frame === f ? 'bg-purple-500' : 'bg-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* 背景选择 */}
        <div>
          <label className="text-xs text-gray-400">背景</label>
          <select
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="w-full mt-1 px-2 py-1 text-xs bg-gray-700 rounded"
          >
            {BACKGROUNDS.map(bg => (
              <option key={bg} value={bg}>
                {bg.split('/').pop()?.replace('.png', '')}
              </option>
            ))}
          </select>
        </div>

        {/* 参数ID - 用于AI返回 */}
        <div>
          <label className="text-xs text-cyan-400">参数ID (AI返回)</label>
          <input
            type="text"
            value={paramId}
            onChange={(e) => setParamId(e.target.value)}
            placeholder="如: 婴儿_walk_1"
            className="w-full mt-1 px-2 py-1 text-xs bg-gray-700 rounded text-cyan-300"
          />
        </div>

        {/* 当前图片ID */}
        <div className="text-xs text-yellow-400 bg-yellow-900/30 p-2 rounded break-all">
          ID: {currentId}
        </div>

        {/* 关键点编辑 */}
        <div>
          <label className="text-xs text-gray-400">编辑关键点</label>
          <div className="flex gap-1 mt-1">
            {KEYPOINTS.map((kp, i) => (
              <button
                key={i}
                onClick={() => setEditKeypointIndex(i as 0 | 1 | 2)}
                className={`flex-1 px-2 py-1 text-xs rounded ${
                  editKeypointIndex === i ? 'bg-orange-500' : 'bg-gray-700'
                }`}
              >
                {kp}
              </button>
            ))}
          </div>
        </div>

        {/* 位置编辑 */}
        <div>
          <label className="text-xs text-gray-400">X: {x}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={x}
            onChange={(e) => setX(Number(e.target.value))}
            className="w-full mt-1"
          />
          <label className="text-xs text-gray-400">Y: {y}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={y}
            onChange={(e) => setY(Number(e.target.value))}
            className="w-full mt-1"
          />
        </div>

        {/* 保存按钮 */}
        <div className="flex gap-1">
          <button
            onClick={saveKeypoint}
            className="flex-1 px-2 py-2 text-xs bg-orange-600 rounded hover:bg-orange-500"
          >
            💾 保存关键点
          </button>
        </div>

        {/* 已保存配置列表 */}
        <div>
          <label className="text-xs text-gray-400">已保存配置 ({Object.keys(configs).length})</label>
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.keys(configs).map(id => (
              <button
                key={id}
                onClick={() => {
                  const parts = id.split('_');
                  setStage(parts[0] as any);
                  setAction(parts[1].replace(/[0-9]/g, '') as any);
                  setFrame(parts[1].match(/[0-9]/)?.[0] ? parseInt(parts[1].match(/[0-9]/)?.[0] || '1') as 1 | 2 : 1);
                  const bgFile = parts.slice(2).join('_');
                  const bg = BACKGROUNDS.find(b => b.includes(bgFile)) || BACKGROUNDS[0];
                  setBackground(bg);
                }}
                className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600"
              >
                {id.split('_')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 导出 */}
        <button
          onClick={exportConfig}
          className="w-full px-2 py-2 text-xs bg-blue-600 rounded hover:bg-blue-500"
        >
          📤 导出配置到Console
        </button>

        {/* 当前配置预览 */}
        <div className="pt-2 border-t border-gray-600 text-xs">
          <p className="text-gray-400">当前关键点:</p>
          {currentConfig.keypoints.map((kp, i) => (
            <p key={i} className={editKeypointIndex === i ? 'text-orange-400' : 'text-gray-500'}>
              {KEYPOINTS[i]}: X={kp.x}% Y={kp.y}%
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
