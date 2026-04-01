import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'motion/react';

// 初始化 Supabase 客户端
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://jminexbqkkfwnlagghha.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaW5leGJxa2tmd25sYWdnaGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4Njk3ODYsImV4cCI6MjA5MDQ0NTc4Nn0.X4QaoC1BXe5nMQpkHICK6bTJqUuJR3eOz9ZvrdHv87I';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

interface DatabaseStats {
  users: number;
  pets: number;
  matches: number;
  conversations: number;
  messages: number;
  realms: number;
  products: number;
  notifications: number;
}

export default function DatabaseAdmin() {
  const [activeTab, setActiveTab] = useState<'users' | 'pets' | 'matches' | 'analytics' | 'logs'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DatabaseStats>({
    users: 0,
    pets: 0,
    matches: 0,
    conversations: 0,
    messages: 0,
    realms: 0,
    products: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});

  // 加载数据
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // 每5秒刷新一次
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 获取用户列表
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // 获取统计数据
      const [
        { count: usersCount },
        { count: petsCount },
        { count: matchesCount },
        { count: conversationsCount },
        { count: messagesCount },
        { count: realmsCount },
        { count: productsCount },
        { count: notificationsCount },
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('pets').select('*', { count: 'exact', head: true }),
        supabase.from('matches').select('*', { count: 'exact', head: true }),
        supabase.from('conversations').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('realms').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('notifications').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        users: usersCount || 0,
        pets: petsCount || 0,
        matches: matchesCount || 0,
        conversations: conversationsCount || 0,
        messages: messagesCount || 0,
        realms: realmsCount || 0,
        products: productsCount || 0,
        notifications: notificationsCount || 0,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditData(user);
    setEditMode(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('users')
        .update(editData)
        .eq('id', selectedUser.id);

      if (error) throw error;
      
      alert('用户信息已更新！');
      setEditMode(false);
      setSelectedUser(null);
      loadData();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('更新失败');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('确定要删除这个用户吗？此操作不可撤销！')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      alert('用户已删除！');
      loadData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('删除失败');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 bg-slate-800 border-b border-slate-700 px-6 py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐾</span>
            <h1 className="text-2xl font-black">PUPY爪住 - 数据库管理面板</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? '刷新中...' : '🔄 立即刷新'}
            </button>
            <span className="text-xs text-slate-400">最后更新: {new Date().toLocaleTimeString('zh-CN')}</span>
          </div>
        </motion.div>
      </header>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-b from-slate-800 to-slate-900">
        {Object.entries(stats).map(([key, value]) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.05 }}
            className="bg-slate-700 rounded-lg p-4 border border-slate-600"
          >
            <p className="text-slate-400 text-sm font-bold uppercase">{key}</p>
            <p className="text-3xl font-black text-emerald-400 mt-2">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* 标签栏 */}
      <div className="flex gap-4 px-6 py-4 border-b border-slate-700 bg-slate-900 overflow-x-auto">
        {(['users', 'pets', 'matches', 'analytics', 'logs'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {tab === 'users' && '👥 用户'}
            {tab === 'pets' && '🐾 宠物'}
            {tab === 'matches' && '💕 配对'}
            {tab === 'analytics' && '📊 数据'}
            {tab === 'logs' && '📋 日志'}
          </button>
        ))}
      </div>

      {/* 主容器 */}
      <div className="p-6 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* 搜索栏 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索用户 (邮箱/用户名/名字)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              </div>

              {/* 用户列表 */}
              <div className="space-y-2">
                {filteredUsers.map((user, idx) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-emerald-500 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {user.avatar && (
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                          )}
                          <div>
                            <p className="font-bold text-white">{user.name || user.username}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          ID: {user.id} | 加入: {new Date(user.created_at).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold transition-colors"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-bold transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-lg">没有找到匹配的用户</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <h3 className="text-lg font-bold mb-4">📈 数据增长趋势</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>用户注册</span>
                    <span className="text-emerald-400 font-bold">{stats.users} 人</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((stats.users / 1000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <h3 className="text-lg font-bold mb-4">💬 活跃度统计</h3>
                <div className="space-y-2 text-sm">
                  <p>消息总数: <span className="text-emerald-400 font-bold">{stats.messages}</span></p>
                  <p>配对数: <span className="text-emerald-400 font-bold">{stats.matches}</span></p>
                  <p>平均消息/用户: <span className="text-emerald-400 font-bold">
                    {stats.users > 0 ? (stats.messages / stats.users).toFixed(2) : 0}
                  </span></p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 编辑用户 Modal */}
      {editMode && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-lg p-8 max-w-md w-full mx-4 space-y-6 border border-slate-700 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-black">编辑用户: {selectedUser.name}</h2>

            {Object.keys(editData)
              .filter(key => !['id', 'created_at', 'updated_at'].includes(key))
              .map(key => (
                <div key={key}>
                  <label className="block text-sm font-bold mb-2 text-slate-300">{key}</label>
                  <input
                    type="text"
                    value={editData[key] || ''}
                    onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ))}

            <div className="flex gap-3">
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg font-bold transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveUser}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold transition-colors"
              >
                保存
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
