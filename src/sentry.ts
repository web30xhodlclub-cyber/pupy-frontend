import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { ReplayIntegration } from "@sentry/replay";

/**
 * Sentry 错误监控和性能追踪初始化
 * 用于生产环境的实时错误告警和性能监控
 */
export function initSentry() {
  // 只在生产环境初始化
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  Sentry.init({
    // DSN 配置 (从 Sentry.io 获取)
    dsn: process.env.VITE_SENTRY_DSN || "https://your-sentry-dsn@sentry.io/projectid",
    
    // 环境标识
    environment: process.env.NODE_ENV,
    release: "pupy-frontend@3.0.0",
    
    // 性能监控采样率 (100% = 生产环境所有请求)
    tracesSampleRate: 0.1,  // 10% 采样率可降低成本
    
    // 集成
    integrations: [
      // 浏览器追踪
      new BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          window.history
        ),
      }),
      
      // 会话回放
      new ReplayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // 附加context
    beforeSend(event, hint) {
      // 过滤一些不必要的错误
      if (event.exception) {
        const error = hint.originalException;
        
        // 过滤网络错误
        if (error && error.message && error.message.includes('Network')) {
          return null;
        }
      }
      
      return event;
    },

    // 性能监控配置
    maxValueLength: 1024,
    denyUrls: [
      // 过滤第三方脚本错误
      /extensions\//i,
      /unhandledrejection/i,
    ],
  });

  // 设置用户信息 (登录后)
  Sentry.setUser({
    id: "user-id",
    email: "user@example.com",
  });

  // 添加tag用于分类
  Sentry.setTag("component", "react");
  Sentry.setTag("platform", "web");
}

/**
 * Sentry 告警规则配置 (在 Sentry.io 中手动配置)
 * 
 * 规则1: 错误率告警
 * - 条件: 错误率 > 5%
 * - 时间: 持续 5 分钟
 * - 行动: 邮件 + Slack 通知
 * 
 * 规则2: 新错误告警
 * - 条件: 新错误类型出现
 * - 时间: 立即
 * - 行动: 邮件通知
 * 
 * 规则3: 性能降级
 * - 条件: 响应时间 > 3 秒
 * - 时间: 持续 10 分钟
 * - 行动: Slack 通知
 */

export default Sentry;
