# 创业适配度诊断 - Day 1 MVP

## 快速启动

### 1. 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd backend
npm install
```

### 2. 启动服务

```bash
# 终端1 - 启动后端
cd backend
npm start

# 终端2 - 启动前端
cd frontend
npm run dev
```

### 3. 访问

打开浏览器访问：http://localhost:3000

## 项目结构

```
├── frontend/              # 前端代码
│   ├── src/
│   │   ├── pages/        # 页面组件
│   │   ├── utils/        # 工具函数
│   │   └── App.jsx       # 主应用
│   └── package.json
│
├── backend/              # 后端代码
│   ├── server.js        # 主服务器
│   ├── scoring.js       # 评分算法
│   └── data/            # 数据存储
│
└── docs/                # 文档
```

## 功能清单

### ✅ 已完成
- [x] 开始页（焦虑场景引入）
- [x] 6个核心问题流程
- [x] 进度条显示
- [x] 结果页（分数+建议）
- [x] 评分算法
- [x] 数据埋点
- [x] 数据存储

### 🚧 待优化（Day 2）
- [ ] AI对话追问
- [ ] 即时反馈
- [ ] 结果页视觉优化
- [ ] 分享功能

## 数据说明

所有数据存储在 `backend/data/` 目录：
- `answers.json` - 用户答案
- `analytics.json` - 埋点数据
- `contacts.json` - 联系方式