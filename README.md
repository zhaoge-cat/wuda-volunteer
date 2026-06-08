# 唔嗒旅游志愿服务平台

面向唔嗒旅游志愿服务体系的数字化管理平台，覆盖普通志愿者、小队长、站点站长三类岗位人员。借鉴QQ徽章展馆陈列模式与泡泡玛特盲盒系列化收集逻辑，打造集个人电子档案、多维度综合评价、电子徽章展馆、盲盒趣味激励、荣誉榜单公示、活动报名通知、后台智能管理于一体的专属数字化服务平台。

## 技术栈

- **前端**：React 18 + TypeScript + TailwindCSS + Zustand + Framer Motion + Recharts
- **后端**：Express 4 + TypeScript + SQLite (better-sqlite3)
- **构建工具**：Vite + Nodemon

## 功能模块

| 模块 | 说明 |
|------|------|
| 首页仪表盘 | 服务数据概览、快捷操作、近期活动、通知消息 |
| 签到签退 | 用户自助签到/签退，实时记录服务时间 |
| 个人中心 | 电子志愿档案、服务记录时间线、综合评价、荣誉履历 |
| 电子徽章展馆 | 分类宫格展示（等级/岗位/盲盒系列）、点亮锁定、套装进度、置顶管理 |
| 盲盒中心 | 3D翻转动画抽取、普通/稀有/隐藏限定三档、图鉴收集、系列进度 |
| 荣誉榜单 | 月度/季度之星、优秀志愿者/小队长/站长、徽章收藏达人 |
| 活动中心 | 活动列表、在线报名、岗位选择、我的报名 |
| 权益中心 | 等级权益展示、活动优先资格、实践证明下载 |
| 管理后台 | 班次管理、考勤管理、服务打分、数据统计 |

## 核心特色

- **岗位分层评价**：区分普通志愿者、小队长、站长岗位职责与工作权重
- **荣誉可视化**：QQ徽章展馆模式，图鉴墙集中陈列电子徽章
- **趣味激励**：泡泡玛特系列盲盒玩法，分款式、分稀有度、成套收集
- **多维度考核**：出勤(25%) + 服务质量(30%) + 岗位权重(25%) + 纪律(20%) 加权评分
- **线上线下联动**：荣誉榜单对接线下表扬墙与公众号推文表彰

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
cd wuda-volunteer
npm install
```

### 启动开发服务器

```bash
npm run dev
```

前端运行在 http://localhost:5173 ，后端 API 运行在 http://localhost:3001 。

### 构建生产版本

```bash
npm run build
```

## 测试账号

| 角色 | 手机号 | 密码 |
|------|--------|------|
| 管理员 | 13800000000 | admin123 |
| 普通志愿者 | 13800000001 | 123456 |
| 小队长 | 13800000002 | 123456 |
| 站点站长 | 13800000003 | 123456 |

## 项目结构

```
wuda-volunteer/
├── api/                    # 后端代码
│   ├── app.ts              # Express 应用入口
│   ├── server.ts           # 服务器启动
│   ├── db.ts               # SQLite 数据库初始化与种子数据
│   ├── data/               # SQLite 数据库文件（自动生成）
│   └── routes/             # API 路由
│       ├── auth.ts         # 认证（登录/注册）
│       ├── users.ts        # 用户信息
│       ├── badges.ts       # 徽章管理
│       ├── blindbox.ts     # 盲盒抽取
│       ├── activities.ts   # 活动管理
│       ├── honors.ts       # 荣誉榜单
│       ├── evaluations.ts  # 综合评价
│       ├── benefits.ts     # 权益中心
│       └── admin.ts        # 管理后台
├── src/                    # 前端代码
│   ├── App.tsx             # 路由配置
│   ├── main.tsx            # 入口文件
│   ├── index.css           # 全局样式
│   ├── store/              # Zustand 状态管理
│   ├── lib/                # 工具函数与 API 层
│   ├── components/         # 公共组件
│   │   └── Layout.tsx      # 侧边栏布局
│   └── pages/              # 页面组件
│       ├── Login.tsx       # 登录/注册
│       ├── Dashboard.tsx   # 首页仪表盘
│       ├── CheckIn.tsx     # 签到签退
│       ├── Profile.tsx     # 个人中心
│       ├── Badges.tsx      # 徽章展馆
│       ├── BlindBox.tsx    # 盲盒中心
│       ├── Honors.tsx      # 荣誉榜单
│       ├── Activities.tsx  # 活动中心
│       ├── Benefits.tsx    # 权益中心
│       └── admin/          # 管理后台页面
│           ├── Dashboard.tsx
│           ├── Shifts.tsx
│           ├── Attendance.tsx
│           ├── Scoring.tsx
│           └── Stats.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## API 概览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/login | 登录 |
| POST | /api/auth/register | 注册 |
| GET | /api/users/:id | 获取用户信息 |
| GET | /api/badges?userId= | 获取徽章列表（含解锁状态） |
| GET | /api/badges/series?userId= | 获取徽章系列进度 |
| PUT | /api/badges/:id/pin | 置顶/取消置顶徽章 |
| GET | /api/blindbox/draw-count?userId= | 获取可抽取次数 |
| POST | /api/blindbox/draw | 抽取盲盒 |
| GET | /api/blindbox/collection?userId= | 获取盲盒图鉴 |
| GET | /api/activities | 活动列表 |
| POST | /api/activities/:id/register | 报名活动 |
| GET | /api/activities/my?userId= | 我的报名 |
| GET | /api/honors | 荣誉榜单 |
| GET | /api/evaluations/:userId | 评价记录 |
| POST | /api/evaluations | 创建评价（自动算分） |
| GET | /api/benefits?userId= | 权益列表 |
| GET | /api/admin/stats | 管理后台统计 |
| POST | /api/admin/shifts | 创建班次 |
| POST | /api/admin/attendance/check-in | 签到 |
| POST | /api/admin/attendance/check-out | 签退 |

## 设计规范

- **主色调**：活力橙 `#FF6B35` + 深海蓝 `#1A365D`
- **辅助色**：金色 `#F6AD55`、翡翠绿 `#48BB78`、珊瑚粉 `#FC8181`
- **布局**：左侧固定导航栏 + 右侧内容区，卡片式模块布局
- **图标**：Lucide React 线性图标
- **动画**：Framer Motion 页面切换 + CSS 盲盒3D翻转/徽章光效
