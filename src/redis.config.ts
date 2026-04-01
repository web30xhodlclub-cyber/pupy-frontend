/**
 * Redis 缓存配置
 * 用于后端性能优化和数据缓存
 * 
 * 依赖安装:
 * npm install ioredis
 */

import Redis from 'ioredis';

/**
 * Redis 客户端配置
 */
const redis = new Redis({
  // Redis 连接配置
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: 0,
  
  // 连接池配置
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },

  // 超时配置
  commandTimeout: 5000,
  connectTimeout: 10000,

  // 启用离线队列
  enableOfflineQueue: true,

  // 自动重新连接
  autoResubscribe: true,
  autoResSubscribe: true,
});

/**
 * Redis 缓存策略和工具函数
 */

// 通用键前缀
export const CACHE_KEYS = {
  USER: (id: string) => `user:${id}`,
  PET: (id: string) => `pet:${id}`,
  MATCH: (id: string) => `match:${id}`,
  MESSAGE: (id: string) => `msg:${id}`,
  REALM: (id: string) => `realm:${id}`,
  PRODUCT: (id: string) => `product:${id}`,
  FEED: (userId: string) => `feed:${userId}`,
  STATS: () => 'stats:global',
};

// 缓存过期时间 (秒)
export const CACHE_TTL = {
  SHORT: 300,        // 5 分钟
  MEDIUM: 3600,      // 1 小时
  LONG: 86400,       // 24 小时
  WEEK: 604800,      // 7 天
};

/**
 * 缓存用户信息
 * @param userId 用户ID
 * @param userData 用户数据
 */
export async function cacheUser(userId: string, userData: any) {
  const key = CACHE_KEYS.USER(userId);
  await redis.setex(key, CACHE_TTL.LONG, JSON.stringify(userData));
}

/**
 * 获取缓存的用户信息
 * @param userId 用户ID
 */
export async function getCachedUser(userId: string) {
  const key = CACHE_KEYS.USER(userId);
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

/**
 * 缓存宠物列表
 * @param userId 用户ID
 * @param pets 宠物列表
 */
export async function cachePetsList(userId: string, pets: any[]) {
  const key = `pets:${userId}`;
  await redis.setex(key, CACHE_TTL.MEDIUM, JSON.stringify(pets));
}

/**
 * 缓存配对结果
 * @param matchId 配对ID
 * @param matchData 配对数据
 */
export async function cacheMatch(matchId: string, matchData: any) {
  const key = CACHE_KEYS.MATCH(matchId);
  await redis.setex(key, CACHE_TTL.MEDIUM, JSON.stringify(matchData));
}

/**
 * 缓存全局统计
 * @param stats 统计数据
 */
export async function cacheStats(stats: any) {
  const key = CACHE_KEYS.STATS();
  await redis.setex(key, CACHE_TTL.SHORT, JSON.stringify(stats));
}

/**
 * 清除用户缓存
 * @param userId 用户ID
 */
export async function clearUserCache(userId: string) {
  const pattern = `*:${userId}`;
  const keys = await redis.keys(pattern);
  
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

/**
 * 清除所有缓存
 * 谨慎使用 - 仅在必要时清空
 */
export async function clearAllCache() {
  await redis.flushdb();
}

/**
 * 获取缓存统计
 */
export async function getCacheStats() {
  const info = await redis.info('stats');
  const dbStats = await redis.info('keyspace');
  
  return {
    info,
    dbStats,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Redis 错误处理
 */
redis.on('error', (err) => {
  console.error('Redis错误:', err);
  // 可选: 发送告警
});

redis.on('connect', () => {
  console.log('✅ Redis 已连接');
});

redis.on('disconnect', () => {
  console.warn('⚠️  Redis 已断开连接');
});

/**
 * 缓存中间件 (Express)
 * 
 * 使用方式:
 * app.get('/api/user/:id', cacheMiddleware(CACHE_TTL.LONG), getUserHandler);
 */
export function cacheMiddleware(ttl: number) {
  return async (req: any, res: any, next: any) => {
    const key = `route:${req.originalUrl}`;
    
    try {
      // 尝试从缓存读取
      const cached = await redis.get(key);
      if (cached) {
        res.set('X-Cache', 'HIT');
        return res.json(JSON.parse(cached));
      }
      
      // 缓存未命中，继续处理请求
      res.set('X-Cache', 'MISS');
      
      // 拦截响应以缓存数据
      const originalJson = res.json;
      res.json = function(data: any) {
        redis.setex(key, ttl, JSON.stringify(data)).catch(console.error);
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('缓存中间件错误:', error);
      next();  // 缓存失败时继续处理请求
    }
  };
}

/**
 * 会话存储 (Express Session)
 * 
 * 使用方式:
 * const session = require('express-session');
 * const RedisStore = require('connect-redis').default;
 * 
 * app.use(session({
 *   store: new RedisStore({ client: redis }),
 *   secret: process.env.SESSION_SECRET,
 *   resave: false,
 *   saveUninitialized: false,
 * }));
 */

export default redis;
