import { useState, useEffect } from 'react';
import { PETS, REALMS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { realmAPI } from '../services/api';

interface Room {
  id: string;
  name: string;
  map: string;
  map_name: string;
  map_image?: string;
  roomCode: string;
  currentUsers?: number;
  capacity?: number;
  createdAt?: string;
}

export default function Tour({ onSelectRealm }: { onSelectRealm: () => void }) {
  const [view, setView] = useState<'map' | 'realms' | 'rooms'>('map');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 创建房间的表单数据
  const [createForm, setCreateForm] = useState({
    name: '',
    map: 'realm-1', // 默认选择第一个地图
    roomCode: '',
    roomPassword: '',
    capacity: 10
  });

  // 加入房间的表单数据
  const [joinForm, setJoinForm] = useState({
    roomCode: '',
    roomPassword: ''
  });

  // 加载我的小院儿
  useEffect(() => {
    if (view === 'rooms') {
      loadMyRooms();
    }
  }, [view]);

  const loadMyRooms = async () => {
    try {
      setIsLoading(true);
      const result = await realmAPI.getMyRooms();
      
      if (result.success && result.data) {
        setMyRooms(result.data.owned || []);
        setJoinedRooms(result.data.joined || []);
      }
    } catch (err) {
      console.error('加载小院儿失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const mapOptions = [
    { id: 'realm-1', name: '🌲 躲雨深林', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800', description: '神秘的森林小院儿，宠物可以在这里相遇' },
    { id: 'realm-2', name: '🏖️ 阳光海滩', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800', description: '温暖的海边小院儿，适合玩耍和休息' },
    { id: 'realm-3', name: '⛰️ 高山牧场', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', description: '宽敞的牧场小院儿，空间无限' },
  ];

  const handleCreateRoom = async () => {
    if (!createForm.name || !createForm.map || !createForm.roomCode || !createForm.roomPassword) {
      setError('请填写所有信息');
      return;
    }

    // 验证房间代号格式
    if (createForm.roomCode.length < 4 || createForm.roomCode.length > 20) {
      setError('房间代号需要4-20个字符');
      return;
    }

    // 验证密码长度
    if (createForm.roomPassword.length < 4) {
      setError('密码至少需要4个字符');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await realmAPI.createRoom({
        name: createForm.name,
        map: createForm.map,
        roomCode: createForm.roomCode,
        roomPassword: createForm.roomPassword,
        capacity: createForm.capacity
      });

      if (result.success) {
        alert('小院儿创建成功！');
        setShowCreateRoom(false);
        setCreateForm({ name: '', map: 'realm-1', roomCode: '', roomPassword: '', capacity: 10 });
        loadMyRooms(); // 刷新列表
      } else {
        setError(result.message || '创建失败');
      }
    } catch (err: any) {
      console.error('创建小院儿失败:', err);
      setError(err.message || '创建失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinForm.roomCode || !joinForm.roomPassword) {
      setError('请输入房间代号和密码');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await realmAPI.joinRoom(joinForm.roomCode, joinForm.roomPassword);

      if (result.success) {
        alert('加入小院儿成功！');
        setShowJoinRoom(false);
        setJoinForm({ roomCode: '', roomPassword: '' });
        loadMyRooms(); // 刷新列表
        onSelectRealm(); // 进入小院儿
      } else {
        setError(result.message || '加入失败');
      }
    } catch (err: any) {
      console.error('加入小院儿失败:', err);
      setError(err.message || '加入失败，请检查房间代号和密码');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 space-y-8 pb-10">
      <section className="text-center space-y-2">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary italic">随风溜溜</h1>
        <p className="text-slate-500 font-medium tracking-tight">在云端与现实的交界处，偶遇有趣的灵魂</p>
      </section>

      {/* View Switcher */}
      <div className="flex justify-center p-1 bg-slate-100 rounded-[2rem] max-w-[400px] mx-auto">
        <button 
          onClick={() => setView('map')}
          className={`flex-1 py-3 rounded-[1.8rem] text-xs font-black transition-all ${view === 'map' ? 'bg-white text-primary shadow-lg' : 'text-slate-400'}`}
        >
          云端地图
        </button>
        <button 
          onClick={() => setView('realms')}
          className={`flex-1 py-3 rounded-[1.8rem] text-xs font-black transition-all ${view === 'realms' ? 'bg-white text-primary shadow-lg' : 'text-slate-400'}`}
        >
          探索领域
        </button>
        <button 
          onClick={() => setView('rooms')}
          className={`flex-1 py-3 rounded-[1.8rem] text-xs font-black transition-all ${view === 'rooms' ? 'bg-white text-primary shadow-lg' : 'text-slate-400'}`}
        >
          小院儿
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'map' ? (
          <motion.div 
            key="map"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative aspect-square rounded-[3rem] bg-emerald-50 border-4 border-white shadow-2xl overflow-hidden"
          >
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-200 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-emerald-300 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[20px] border-emerald-100 rounded-full" />
            </div>

            {/* Pet Avatars on Map */}
            {PETS.map((pet, i) => (
              <motion.div 
                key={pet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: [0, 10, -10, 0][i % 4],
                  y: [0, -10, 10, 0][i % 4]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
                className="absolute"
                style={{ 
                  top: `${20 + i * 25}%`, 
                  left: `${20 + (i % 2) * 40}%` 
                }}
              >
                <div className="relative group cursor-pointer" onClick={onSelectRealm}>
                  <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-xl ring-4 ring-emerald-500/20 group-hover:scale-110 transition-transform">
                    <img src={pet.image} alt={pet.name} className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border border-slate-100 whitespace-nowrap">
                    <span className="text-[10px] font-black text-slate-900">{pet.name}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                </div>
              </motion.div>
            ))}

            {/* User Location */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-primary rounded-full border-4 border-white shadow-2xl animate-bounce" />
              <div className="w-16 h-16 bg-primary/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
            </div>

            <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white/50 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">near_me</span>
                  <span className="text-xs font-black text-slate-900 tracking-tight">发现 12 位新朋友在附近</span>
                </div>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest">刷新地图</button>
              </div>
            </div>
          </motion.div>
        ) : view === 'realms' ? (
          <motion.div 
            key="realms"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 gap-6"
          >
            {REALMS.map((realm) => (
              <motion.div
                key={realm.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSelectRealm}
                className="group relative h-64 rounded-[3rem] overflow-hidden shadow-2xl cursor-pointer border-4 border-white"
              >
                <img 
                  src={realm.image} 
                  alt={realm.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-white text-[10px] font-black tracking-widest">{realm.onlineCount} 在线</span>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <span className="material-symbols-outlined text-white text-xl">{realm.icon}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white font-headline tracking-tight">{realm.name}</h3>
                  </div>
                  <p className="text-white/70 text-xs font-medium leading-relaxed line-clamp-2 pr-10">
                    {realm.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : view === 'rooms' ? (
          <motion.div 
            key="rooms"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowCreateRoom(true)}
                className="p-6 bg-primary text-white rounded-[2.5rem] shadow-lg flex flex-col items-center gap-3 active:scale-90 transition-transform font-bold"
              >
                <span className="material-symbols-outlined text-4xl">add_circle</span>
                <span className="text-sm">创建小院儿</span>
              </button>
              <button 
                onClick={() => setShowJoinRoom(true)}
                className="p-6 bg-white text-primary rounded-[2.5rem] shadow-lg flex flex-col items-center gap-3 active:scale-90 transition-transform font-bold border-2 border-primary"
              >
                <span className="material-symbols-outlined text-4xl">login</span>
                <span className="text-sm">加入小院儿</span>
              </button>
            </div>

            {/* 我的小院儿 - 已创建 */}
            {myRooms.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest px-2">我创建的小院儿</h3>
                {myRooms.map((room) => (
                  <motion.div 
                    key={room.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSelectRealm}
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900">{room.name}</h4>
                        <p className="text-xs text-slate-400">代号: {room.roomCode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-emerald-600">{room.currentUsers || 1} 人在线</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* 我加入的小院儿 */}
            {joinedRooms.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest px-2">我加入的小院儿</h3>
                {joinedRooms.map((room) => (
                  <motion.div 
                    key={room.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSelectRealm}
                    className="bg-emerald-50 p-6 rounded-[2rem] shadow-sm border border-emerald-100 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-bold text-emerald-900">{room.name}</h4>
                        <p className="text-xs text-emerald-600">{room.map_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-emerald-600">{room.currentUsers || 1} 人在线</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <p className="text-center text-sm text-slate-400 py-4">
              {myRooms.length === 0 && joinedRooms.length === 0 
                ? '创建专属的虚拟小院儿，邀请朋友和宠物一起玩耍吧！'
                : ''}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* 创建小院儿 Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm max-w-md mx-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] p-8 max-w-sm w-full mx-4 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-black text-slate-900">创建小院儿</h3>
            
            <input 
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
              placeholder="请输入小院儿名称"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20"
            />

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">选择地图</label>
              <div className="space-y-2">
                {mapOptions.map((map) => (
                  <button 
                    key={map.id}
                    onClick={() => setCreateForm({...createForm, map: map.id})}
                    className={`w-full text-left p-3 rounded-2xl border-2 transition-all ${
                      createForm.map === map.id
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-primary/50'
                    }`}
                  >
                    <p className="font-bold">{map.name}</p>
                    <p className="text-xs text-slate-500">{map.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <input 
              type="text"
              value={createForm.roomCode}
              onChange={(e) => setCreateForm({...createForm, roomCode: e.target.value.toUpperCase()})}
              placeholder="房间代号 (4-20字符)"
              maxLength={20}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20"
            />
            <small className="text-slate-400">告诉朋友这个代号让他们加入</small>

            <input 
              type="password"
              value={createForm.roomPassword}
              onChange={(e) => setCreateForm({...createForm, roomPassword: e.target.value})}
              placeholder="房间密码 (至少4字符)"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20"
            />

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  setShowCreateRoom(false);
                  setCreateForm({name: '', map: 'realm-1', roomCode: '', roomPassword: '', capacity: 10});
                  setError(null);
                }}
                className="py-3 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 active:scale-95 transition-transform"
              >
                取消
              </button>
              <button 
                onClick={handleCreateRoom}
                disabled={isLoading}
                className="py-3 rounded-2xl bg-primary text-white font-bold active:scale-95 transition-transform disabled:opacity-50"
              >
                {isLoading ? '创建中...' : '创建'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 加入小院儿 Modal */}
      {showJoinRoom && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm max-w-md mx-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] p-8 max-w-sm w-full mx-4 space-y-6 shadow-2xl"
          >
            <h3 className="text-2xl font-black text-slate-900">加入小院儿</h3>
            
            <input 
              type="text"
              value={joinForm.roomCode}
              onChange={(e) => setJoinForm({...joinForm, roomCode: e.target.value.toUpperCase()})}
              placeholder="房间代号"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20"
            />

            <input 
              type="password"
              value={joinForm.roomPassword}
              onChange={(e) => setJoinForm({...joinForm, roomPassword: e.target.value})}
              placeholder="房间密码"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20"
            />

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  setShowJoinRoom(false);
                  setJoinForm({roomCode: '', roomPassword: ''});
                  setError(null);
                }}
                className="py-3 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 active:scale-95 transition-transform"
              >
                取消
              </button>
              <button 
                onClick={handleJoinRoom}
                disabled={isLoading}
                className="py-3 rounded-2xl bg-primary text-white font-bold active:scale-95 transition-transform disabled:opacity-50"
              >
                {isLoading ? '加入中...' : '加入'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}