# 🚀 PUPY 前端 V3 - 一键部署参考卡

**快速查阅**: 粘贴即用，5分钟上线生产

---

## ⚡ 最快部署 (5分钟 - Vercel CLI)

```bash
# 1️⃣ 安装 Vercel CLI (首次，1分钟)
npm install -g vercel

# 2️⃣ 登录 Vercel (1分钟)
vercel login

# 3️⃣ 部署到生产 (3分钟)
vercel --prod

# 完成! 🎉
# 查看输出中的生产 URL
```

**预期输出**:
```
✅ Build completed
✅ Deployed to: https://pupy.vercel.app
✅ Assigned domain: pupy.vercel.app
```

---

## 📋 部署前检查 (30秒)

```bash
# 验证环境
npm --version          # v18+
node --version         # v18+

# 验证项目
npm run build          # 检查是否构建成功
npm run dev            # 检查本地是否运行

# 验证配置
cat .env.production    # 检查环境变量
```

**预期结果**: ✅ 所有检查通过

---

## 🔑 环境变量配置

### 生产环境变量 (.env.production)

```env
# Supabase
VITE_SUPABASE_URL=https://jminexbqkkfwnlagghha.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here

# API
VITE_API_BASE_URL=https://api.pupy.app
VITE_API_TIMEOUT=30000

# Monitoring
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_DATADOG_APPLICATION_ID=xxx
VITE_DATADOG_CLIENT_TOKEN=xxx

# Cache
REDIS_HOST=redis.pupy.com
REDIS_PORT=6379
REDIS_PASSWORD=xxxxx

# CDN
VITE_CDN_URL=https://cdn.pupy.app

# Analytics
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXX
```

---

## 🎯 部署方式对比

| 方式 | 时间 | 难度 | 适用场景 |
|------|------|------|---------|
| **Vercel CLI** | 5分钟 | ⭐️ | 一次性部署 ✅ 推荐 |
| **GitHub Push** | 2分钟 | ⭐️️ | 持续部署 ✅ 最佳 |
| **Vercel 仪表板** | 10分钟 | ⭐️️ | 无需 CLI |
| **Netlify** | 8分钟 | ⭐️️ | 备选方案 |
| **自托管 (Nginx)** | 15分钟 | ⭐️️️ | Docker 容器 |

---

## 🔄 持续部署设置 (推荐)

### GitHub 集成 (完全自动)

```bash
# 1. 确保项目在 GitHub
git remote -v
# 输出应该显示:
# origin  https://github.com/username/pupy.git

# 2. Push 到 main 分支
git add .
git commit -m "Release: v3.0.0"
git push origin main

# 3. Vercel 自动部署
# → 检查 https://vercel.com/dashboard
# → 部署自动开始
# → 5分钟后完成 ✅
```

**对于后续更新**:
```bash
# 只需每次 push，Vercel 自动部署
git push origin main  # 自动触发部署!
```

---

## 📊 监控部署

### 部署后立即检查

```bash
# 检查 1: 应用可访问性
curl https://pupy.vercel.app/

# 检查 2: API 连接
curl https://pupy.vercel.app/api/health

# 检查 3: Sentry 健康
# 访问 https://sentry.io/organizations/your-org/
# 检查是否收到错误

# 检查 4: 性能指标
# 访问 https://vercel.com/dashboard/pupy
# 查看 Performance 标签页
```

### 预期结果 (✅ 全部绿色)

```
✅ 应用正常加载 (< 2秒)
✅ API 返回 200 状态码
✅ Sentry 连接正常
✅ 性能指标良好
✅ Lighthouse > 90
✅ 无错误告警
```

---

## 🛠️ 故障排除 (紧急)

### 问题 1: 部署失败

```bash
# 原因: package.json 有问题
# 解决:
npm install                 # 重新安装依赖
npm run build              # 测试本地构建
npm audit fix              # 修复安全问题
git push origin main       # 重新提交

# 或者手动部署:
vercel --prod --force
```

### 问题 2: API 连接失败

```bash
# 原因: .env.production 配置错误
# 解决:

# 1. 检查变量
cat .env.production

# 2. 在 Vercel 仪表板添加变量
# 访问: https://vercel.com/dashboard/pupy/settings/environment-variables
# 添加缺失的环境变量
# 重新部署: vercel --prod --force

# 3. 清除缓存
vercel env pull            # 拉取环境变量
npm run build              # 重新构建
npm run dev                # 本地测试
vercel --prod              # 重新部署
```

### 问题 3: 性能下降

```bash
# 原因: 代码分割或缓存问题
# 解决:

# 1. 检查构建大小
npm run build              # 查看输出大小

# 2. 分析包大小
npm install -g source-map-explorer
source-map-explorer 'dist/**/*.js'

# 3. 优化并重新部署
# 按照 PERFORMANCE_OPTIMIZATION.md 优化
npm run build
vercel --prod
```

### 问题 4: 白屏或崩溃

```bash
# 原因: JavaScript 错误或资源加载失败
# 解决:

# 1. 检查浏览器控制台错误
# F12 → Console → 查看红色错误

# 2. 检查网络选项卡
# F12 → Network → 查看失败的请求

# 3. 查看 Sentry 错误
# https://sentry.io/ → 查看错误详情

# 4. 如果是 API 错误，检查后端
# 访问后端 API 端点是否正常

# 5. 回滚上个版本
vercel rollback
```

---

## ✅ 部署完成检查清单

部署后执行 (控制+C 复制粘贴)

```bash
#!/bin/bash
echo "=== PUPY V3 部署完成检查 ==="

# 1. 应用加载测试
echo "1️⃣ 检查应用加载..."
response=$(curl -s -o /dev/null -w "%{http_code}" https://pupy.vercel.app/)
if [ "$response" == "200" ]; then
  echo "✅ 应用加载成功"
else
  echo "❌ 应用加载失败 (HTTP $response)"
fi

# 2. 首屏性能测试
echo "2️⃣ 检查首屏加载时间..."
# 访问 https://pagespeed.web.dev/?url=https://pupy.vercel.app

# 3. 环境变量检查
echo "3️⃣ 检查环境变量..."
echo "📝 访问 Vercel 仪表板验证环境变量已配置"

# 4. 监控连接检查
echo "4️⃣ 检查监控系统..."
echo "📝 访问 https://sentry.io/ 验证连接"

# 5. 功能测试
echo "5️⃣ 执行功能测试..."
echo "📝 访问应用并测试核心功能"

echo ""
echo "=== 部署检查完成 ==="
```

---

## 📞 部署支持信息

### Vercel 资源

- **仪表板**: https://vercel.com/dashboard
- **文档**: https://vercel.com/docs
- **支持**: https://vercel.com/support

### 应用资源

- **应用 URL**: https://pupy.vercel.app
- **API 端点**: https://api.pupy.app
- **Admin 面板**: https://pupy.vercel.app/admin

### 监控资源

- **Sentry**: https://sentry.io/
- **Datadog**: https://www.datadoghq.com/
- **LogRocket**: https://logrocket.com/

---

## 🎯 部署后分子清单 (今天完成)

- [ ] ✅ 应用成功部署到生产
- [ ] ✅ 访问生产 URL 并验证应用正常运行
- [ ] ✅ 验证所有功能正常工作
- [ ] ✅ 检查 Sentry 监控连接
- [ ] ✅ 检查 Datadog 日志收集
- [ ] ✅ 运行 Lighthouse 审计
- [ ] ✅ 记录生产 URL 和访问信息
- [ ] ✅ 通知团队部署完成
- [ ] ✅ 发送用户升级通知
- [ ] ✅ 监控首小时性能和错误

---

## 🎊 部署成功标志

```
当你看到以下信息时，表示部署成功 ✅:

✨ https://pupy.vercel.app
   └─ 应用加载正常
   
✅ Lighthouse 评分 > 90/100
   
✅ Sentry 收到初始化事件
   
✅ 0 个错误告警
   
✅ 性能指标正常

🎉 恭喜! PUPY 前端 V3 已成功上线!
```

---

## 📝 快速参考

### 常用命令

```bash
# 本地开发
npm run dev                # 启动开发服务器

# 构建验证
npm run build             # 验证生产构建

# 依赖管理
npm install               # 安装依赖
npm audit fix            # 修复漏洞

# Vercel CLI
vercel login             # 登录 Vercel
vercel --prod            # 部署到生产
vercel rollback          # 回滚版本
vercel env pull          # 拉取环境变量

# Git 操作
git push origin main     # Push 触发自动部署
git tag v3.0.0          # 标记版本
git push origin v3.0.0   # Push 标记
```

### 重要链接

| 链接 | 用途 |
|------|------|
| https://vercel.com/dashboard | 监控部署 |
| https://sentry.io | 错误监控 |
| https://datadog.com | 性能监控 |
| https://github.com | 代码仓库 |
| https://pupy.vercel.app | 生产应用 |
| https://pupy.vercel.app/admin | 管理面板 |

---

## 🎓 学习资源

- **Vercel 部署**: https://vercel.com/docs/concepts/deployments/overview
- **环境变量**: https://vercel.com/docs/concepts/projects/environment-variables
- **CDN & 缓存**: https://vercel.com/docs/concepts/cdn/overview
- **性能优化**: https://vercel.com/docs/concepts/performance/overview
- **监控告警**: https://vercel.com/docs/concepts/monitoring/performance

---

## 🎉 最终提示

```
✨ 5 分钟后，你的 PUPY 前端就会在生产环境中运行!

记住:
  1️⃣  不要害怕！所有检查都已通过
  2️⃣  如遇错误，按照故障排除指南处理
  3️⃣  部署后立即监控性能和错误
  4️⃣  遇到问题随时回滚到之前版本

🚀 现在就开始部署吧!
```

---

**最后确认**: 所有部署资源已准备就绪，可立即执行 ✅

