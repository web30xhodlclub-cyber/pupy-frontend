# 🚀 PUPY 前端 - Vercel 免费部署完整指南

**部署日期**: 2026年4月1日  
**部署方式**: Vercel 免费计划  
**预计上线**: 15-20 分钟

---

## 📋 部署前检查清单

### 第1步: 本地构建验证 (2分钟)

```bash
# 进入项目目录
cd "c:\Users\selin\Desktop\PUPY-爪住\前端V3"

# 验证构建
npm run build
```

**预期输出:**
```
✅ 487 modules transformed
✅ dist/index.html (0.66 KB)
✅ dist/admin.html (0.57 KB)
✅ dist/assets/main.js (106 KB)
✅ dist/assets/admin.js (202 KB)
```

---

## 🔑 方式1: GitHub + Vercel 自动部署 (推荐，最简单)

### 第2步: 推送到 GitHub (3分钟)

```bash
# 检查 GitHub 连接
git remote -v

# 如果没有 GitHub 仓库，创建一个：
git init
git add .
git commit -m "Initial commit: PUPY Frontend V3 Release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pupy-frontend.git
git push -u origin main
```

### 第3步: 在 Vercel 中创建项目 (5分钟)

#### 步骤 A: 访问 Vercel

1. 访问 **https://vercel.com**
2. 点击 **"Sign Up"** (如果没有账户)
3. 用 GitHub 账号登录

#### 步骤 B: 导入项目

1. 点击 **"Add New..."** → **"Project"**
2. 选择 **"Import Git Repository"**
3. 搜索 **"pupy-frontend"** 
4. 点击 **"Import"**

#### 步骤 C: 配置项目

```
项目名:          pupy-frontend
Framework:       Vite
Node.js Version: 18.x
```

**点击 "Next"**

#### 步骤 D: 配置环境变量 (关键!)

在 **"Environment Variables"** 部分添加生产环境变量：

```
VITE_SUPABASE_URL=https://jminexbqkkfwnlagghha.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_BASE_URL=https://api.pupy.app
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_DATADOG_APPLICATION_ID=xxx
VITE_DATADOG_CLIENT_TOKEN=xxx
REDIS_HOST=redis.pupy.com
REDIS_PORT=6379
REDIS_PASSWORD=xxxxx
VITE_CDN_URL=https://cdn.pupy.app
```

**点击 "Deploy"**

### 第4步: 等待部署完成 (5-10分钟)

```
✅ 构建中...
✅ 优化中...
✅ 部署中...
✅ 完成!
```

### 第5步: 获取免费域名链接

部署完成后，Vercel 会自动生成免费域名：

```
🎉 默认链接: https://pupy-frontend.vercel.app
```

---

## 🌐 应用链接 (Vercel 免费域名)

### 主应用 (用户使用)

```
https://pupy-frontend.vercel.app
```

**功能:**
- ✅ 首页配对系统
- ✅ 个人档案
- ✅ 宠物创建
- ✅ 虚拟房间
- ✅ 市集应用
- ✅ 消息系统

### 管理面板 (后台管理)

```
https://pupy-frontend.vercel.app/admin
```

**功能:**
- ✅ 用户管理
- ✅ 宠物管理
- ✅ 配对管理
- ✅ 消息管理
- ✅ 数据库控制台
- ✅ 日志查看
- ✅ 设置管理

---

## 📊 部署后操作

### 1️⃣ 验证应用正常 (2分钟)

```bash
# 测试主应用
curl https://pupy-frontend.vercel.app/

# 测试管理面板
curl https://pupy-frontend.vercel.app/admin

# 查看 Vercel 仪表板
# https://vercel.com/dashboard/pupy-frontend
```

### 2️⃣ 配置自定义域名 (可选，10分钟)

如果需要自定义域名 (例如 `pupy.app`):

1. 在 Vercel 仪表板中选择项目
2. 点击 **"Settings"** → **"Domains"**
3. 点击 **"Add Domain"**
4. 输入你的域名 (例如: `pupy.app`)
5. 按照 DNS 指向说明配置

**注意:** 自定义域名需要自己购买 (国内推荐阿里云、腾讯云)

### 3️⃣ 启用 HTTPS (自动)

Vercel 自动为所有应用提供免费的 HTTPS 证书 ✅

---

## 🔄 持续部署 (自动更新)

配置完成后，每次 push 到 GitHub `main` 分支都会自动部署：

```bash
# 本地开发完成后
git add .
git commit -m "Fix: update feature X"
git push origin main

# Vercel 自动检测 → 自动构建 → 自动部署
# 5分钟后访问 https://pupy-frontend.vercel.app 查看更新
```

---

## 🔑 方式2: Vercel CLI 直接部署 (快速，5分钟)

如果不想用 GitHub，可以用 CLI：

### 步骤 1: 安装 Vercel CLI

```bash
npm install -g vercel
```

### 步骤 2: 登录 Vercel

```bash
vercel login
# 按照提示用 GitHub 账号登录
```

### 步骤 3: 部署项目

```bash
# 进入项目目录
cd "c:\Users\selin\Desktop\PUPY-爪住\前端V3"

# 部署到生产环境
vercel --prod
```

**按照提示配置:**
```
? Set up and deploy ".../前端V3"? [Y/n] → y
? Which scope do you want to deploy to? → Your GitHub username
? Link to existing project? [y/N] → N
? What's your project's name? → pupy-frontend
? In which directory is your code located? → .
? Want to override the settings? [y/N] → N
```

**完成后输出:**
```
✅ Production: https://pupy-frontend.vercel.app
```

---

## 🎯 部署完成检查清单

部署后立即执行以下检查：

```
✅ 主应用加载
   访问: https://pupy-frontend.vercel.app
   预期: 正常加载，无白屏

✅ 管理面板访问
   访问: https://pupy-frontend.vercel.app/admin
   预期: 管理面板正常显示

✅ 功能测试
   - 首页配对功能正常
   - 个人档案可以访问
   - 宠物创建可以操作
   - 虚拟房间可以创建
   - 市集服务可以发布
   - 消息系统可以使用

✅ 性能检查
   - 首屏加载 < 3秒
   - 无 JavaScript 错误
   - 网络请求正常

✅ 监控连接
   - Sentry 收到初始化信号
   - Datadog 收到性能数据
   - 日志正常收集
```

---

## 📱 应用功能指南

### 主应用前端 (用户端)

访问: **https://pupy-frontend.vercel.app**

```
首页 (Home)
  └─ 首页配对系统
  └─ 左滑/右滑交互
  └─ 匹配成功通知

档案 (Profile)
  └─ 个人信息显示
  └─ 宠物聊天功能
  └─ AI 自动回复

创建 (Creation)
  └─ 宠物图片上传
  └─ 图片预览
  └─ AI 克隆设置

房间 (Tour)
  └─ 虚拟房间创建
  └─ 房间场景选择
  └─ 多人交互

市集 (Market)
  └─ 溜狗服务发布
  └─ 时间可用性配置
  └─ 支付方式选择

消息 (Messages)
  └─ 消息列表
  └─ 实时聊天
  └─ 消息历史
```

### 管理面板后台

访问: **https://pupy-frontend.vercel.app/admin**

```
数据管理
  ├─ 用户管理 (查看/编辑/删除)
  ├─ 宠物管理 (查看/编辑/删除)
  ├─ 配对管理 (查看历史)
  ├─ 消息管理 (查看/导出)
  ├─ 产品管理 (查看/下架)
  └─ 房间管理 (查看/关闭)

系统管理
  ├─ 日志查看
  ├─ 错误监控 (Sentry)
  ├─ 性能监控 (Datadog)
  ├─ 设置管理
  └─ 数据库控制台
```

---

## 🔗 完整链接汇总

| 应用 | 链接 | 说明 |
|------|------|------|
| **主应用** | https://pupy-frontend.vercel.app | 用户端应用 |
| **管理面板** | https://pupy-frontend.vercel.app/admin | 后台管理 |
| **Vercel 仪表板** | https://vercel.com/dashboard | 项目管理 |
| **GitHub 仓库** | https://github.com/YOUR_USERNAME/pupy-frontend | 代码管理 |
| **Sentry** | https://sentry.io | 错误监控 |
| **Datadog** | https://www.datadoghq.com | 性能监控 |

---

## 📊 Vercel 免费计划限制

```
✅ 支持功能:
  - 自动部署
  - 免费 HTTPS
  - CDN 全球加速
  - 无限制构建
  - 自动扩展

⚠️  限制说明:
  - 带宽: 100GB/月
  - Serverless Functions: 普通函数支持
  - 无自定义域名 (免费计划)
  - 无私有部署

💡 升级选项:
  - Pro 计划: $20/月
  - 支持自定义域名
  - 优先支持
  - 更高性能
```

---

## 🆘 部署常见问题

### Q1: 部署失败 "Build failed"

**原因:** package.json 依赖有问题

**解决:**
```bash
npm install
npm run build  # 测试本地构建
npm audit fix  # 修复漏洞
git push origin main  # 重新部署
```

### Q2: 环境变量不生效

**原因:** Vercel 中没有配置环境变量

**解决:**
1. 访问 Vercel 仪表板
2. 选择项目
3. Settings → Environment Variables
4. 逐个添加生产环境变量
5. 重新部署: `vercel --prod`

### Q3: API 调用失败

**原因:** 后端 URL 配置错误

**解决:**
- 检查 `VITE_API_BASE_URL` 是否指向正确的后端
- 检查 Supabase URL 和 API Key
- 确保后端已启动并可访问

### Q4: 管理面板白屏

**原因:** `/admin` 路径配置问题

**解决:**
1. 检查 `vite.config.ts` 中的 `admin.html` 配置
2. 确认 `vercel.json` 中的重写规则正确
3. 重新部署

---

## ✅ 部署完成确认

```
┌─────────────────────────────────────────────┐
│                                             │
│   ✅ 部署成功 - PUPY 已上线                  │
│                                             │
│   🌐 主应用链接:                             │
│   https://pupy-frontend.vercel.app          │
│                                             │
│   🔧 管理面板链接:                           │
│   https://pupy-frontend.vercel.app/admin    │
│                                             │
│   📊 Vercel 仪表板:                         │
│   https://vercel.com/dashboard/pupy        │
│                                             │
│   ⏱️  部署时间: 2026年4月1日                 │
│   🚀 状态: 已上线，自动更新启用               │
│                                             │
│   下一步: 分享链接给用户使用!                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📞 后续支持

- **问题排查**: 查看本文的 "常见问题" 部分
- **性能优化**: 访问 [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md)
- **部署指南**: 访问 [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)
- **技术支持**: support@pupy.app

---

**开始部署**: 选择方式1或方式2，15分钟内就能获得免费的应用链接! 🚀

