import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { matchAPI, petAPI } from '../services/api';
import type { Pet } from '../types';

interface PetWithOwner extends Pet {
  ownerId?: string;
}

/**
 * 首页 - 滑动配对组件
 * 左滑 = 不喜欢 (dislike) → 显示下一只宠物
 * 右滑 = 喜欢 (like) → 等待双方均喜欢后配对成功
 */
export default function Home({ onMatch }: { onMatch: () => void }) {
  const [pets, setPets] = useState<PetWithOwner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [matchedPet, setMatchedPet] = useState<PetWithOwner | null>(null);
  const [error, setError] = useState<string | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const dislikeOpacity = useTransform(x, [-50, -150], [0, 1]);

  // 加载推荐宠物
  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await matchAPI.getRecommendations();
      if (response.success && response.data && response.data.length > 0) {
        setPets(response.data);
        setCurrentIndex(0);
      } else {
        // 如果没有推荐，显示示例宠物
        setPets(getDefaultPets());
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('加载推荐失败:', err);
      // 使用默认宠物
      setPets(getDefaultPets());
      setCurrentIndex(0);
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultPets = (): PetWithOwner[] => [
    {
      id: 'pet-1',
      name: '小豆子',
      age: 3,
      breed: '金毛寻回犬',
      mbti: 'ENFP',
      tags: ['活泼', '友好', '爱玩球'],
      distance: '2公里',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
      ownerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
      ownerName: '小豆子的铲屎官',
      ownerMbti: 'INFJ',
      ownerSignature: '热爱生活，热爱宠物 ❤️',
      ownerId: 'user-1'
    },
    {
      id: 'pet-2',
      name: '棉花糖',
      age: 2,
      breed: '萨摩耶',
      mbti: 'ESFJ',
      tags: ['可爱', '粘人', '微笑天使'],
      distance: '3公里',
      image: 'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?auto=format&fit=crop&q=80&w=400',
      ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
      ownerName: '莎拉',
      ownerMbti: 'ENFP',
      ownerSignature: '一只狗两条狗三条狗',
      ownerId: 'user-2'
    },
    {
      id: 'pet-3',
      name: '旺财',
      age: 4,
      breed: '柴犬',
      mbti: 'ISTP',
      tags: ['独立', '忠诚', '网红同款'],
      distance: '1公里',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400',
      ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
      ownerName: '马克',
      ownerMbti: 'ISTJ',
      ownerSignature: '🐕',
      ownerId: 'user-3'
    },
    {
      id: 'pet-4',
      name: '小白',
      age: 2,
      breed: '边境牧羊犬',
      mbti: 'INTJ',
      tags: ['高智商', '冠军后代', '学习快'],
      distance: '5公里',
      image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=400',
      ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
      ownerName: '安娜',
      ownerMbti: 'INTJ',
      ownerSignature: '边境牧羊犬爱好者',
      ownerId: 'user-4'
    },
    {
      id: 'pet-5',
      name: '布丁',
      age: 1,
      breed: '比熊犬',
      mbti: 'INFP',
      tags: ['软萌', '安静', '不掉毛'],
      distance: '4公里',
      image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=400',
      ownerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
      ownerName: '米娅',
      ownerMbti: 'INFP',
      ownerSignature: '比熊天下第一可爱',
      ownerId: 'user-5'
    }
  ];

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      swipe('right');
    } else if (info.offset.x < -100) {
      swipe('left');
    }
  };

  const swipe = async (direction: string) => {
    setLastDirection(direction);
    const currentPet = pets[currentIndex];
    
    if (!currentPet) return;

    try {
      setIsLoading(true);
      
      // 调用后端 API 记录匹配
      const result = await matchAPI.createMatch(
        currentPet.id,
        direction === 'right' ? 'like' : 'dislike'
      );

      // 如果是右划且双方都喜欢，触发匹配成功
      if (direction === 'right' && result.data?.isMatched) {
        setMatchedPet(currentPet);
        setTimeout(() => {
          onMatch();
        }, 1500);
      } else if (direction === 'right') {
        // 右划但未匹配成功，提示喜欢已记录
        console.log('喜欢已记录，等待对方喜欢');
      }
      // 左滑 = 不喜欢，直接显示下一只
      
    } catch (err) {
      console.error('记录匹配失败:', err);
    } finally {
      setIsLoading(false);
      
      // 延迟后切换到下一只
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setLastDirection(null);
        x.set(0);
      }, direction === 'left' ? 100 : 300);
    }
  };

  // 加载中状态
  if (isLoading && currentIndex >= pets.length - 1) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-10 text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500">正在寻找附近的PUPY爪住...</p>
      </div>
    );
  }

  // 没有更多宠物
  if (currentIndex >= pets.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-10 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-4xl text-slate-300">sentiment_very_dissatisfied</span>
        </div>
        <h3 className="text-xl font-bold text-slate-800">附近没有更多PUPY爪住了</h3>
        <p className="text-sm text-slate-400">试试扩大搜索范围，或者稍后再来看看吧！</p>
        <button 
          onClick={loadRecommendations}
          className="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
          重新探索
        </button>
      </div>
    );
  }

  const currentPet = pets[currentIndex];
  if (!currentPet) return null;

  // 配对成功提示
  if (matchedPet) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[3rem] p-8 text-center space-y-6 shadow-2xl max-w-sm"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-5xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-primary font-headline">配对成功！</h2>
            <p className="text-slate-600 text-lg">你和 <span className="font-bold">{matchedPet.name}</span> 互相喜欢，可以开始聊天了！</p>
          </div>
          <button
            onClick={() => {
              setMatchedPet(null);
              onMatch();
            }}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            开始聊天 💬
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-6 relative h-[70vh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPet.id}
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            y: 0,
          }}
          exit={{ 
            x: lastDirection === 'right' ? 500 : -500, 
            opacity: 0,
            rotate: lastDirection === 'right' ? 45 : -45,
            transition: { duration: 0.3 }
          }}
          className="absolute inset-x-6 top-0 aspect-[3/4.2] rounded-[3rem] overflow-hidden shadow-2xl bg-white border border-slate-100 touch-none"
        >
          <img 
            src={currentPet.image} 
            alt={currentPet.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          {/* Swipe Feedback */}
          <motion.div 
            style={{ opacity: likeOpacity }}
            className="absolute top-20 right-10 border-4 border-emerald-500 text-emerald-500 font-black text-4xl px-4 py-2 rounded-2xl rotate-12 z-20 pointer-events-none"
          >
            喜欢
          </motion.div>
          <motion.div 
            style={{ opacity: dislikeOpacity }}
            className="absolute top-20 left-10 border-4 border-red-500 text-red-500 font-black text-4xl px-4 py-2 rounded-2xl -rotate-12 z-20 pointer-events-none"
          >
            无感
          </motion.div>

          {/* Owner Info */}
          <div className="absolute top-6 left-6 right-6 flex flex-col gap-2 z-10">
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl p-2 pr-4 rounded-[2rem] border border-white/20 self-start">
              <img src={currentPet.ownerAvatar} alt="主人" className="w-10 h-10 rounded-2xl border-2 border-white/50 object-cover" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-black tracking-tight">{currentPet.ownerName}</span>
                  <span className="bg-primary/80 text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold">{currentPet.ownerMbti}</span>
                </div>
                <p className="text-white/60 text-[10px] truncate max-w-[120px]">{currentPet.ownerSignature}</p>
              </div>
            </div>
            <div className="bg-black/20 backdrop-blur-md self-start px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-white text-xs">near_me</span>
              <span className="text-white text-[10px] font-bold">{currentPet.distance}</span>
            </div>
          </div>

          {/* Pet Info */}
          <div className="absolute bottom-8 left-8 right-8 space-y-4">
            <div className="flex items-end gap-3">
              <h2 className="text-4xl font-black text-white font-headline tracking-tight truncate flex-1">
                {currentPet.name}, {currentPet.age}
              </h2>
              <div className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[10px] font-black tracking-widest mb-1 border border-white/20">
                {currentPet.mbti}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {currentPet.tags.map(tag => (
                <span key={tag} className="bg-white/10 backdrop-blur-md text-white/90 px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Interaction Buttons */}
      <div className="absolute -bottom-24 left-0 right-0 flex items-center justify-center gap-6 pb-4">
        <button 
          onClick={() => swipe('left')}
          disabled={isLoading}
          className="w-16 h-16 rounded-[2rem] bg-white flex items-center justify-center text-red-400 shadow-xl hover:scale-110 active:scale-90 transition-all border border-slate-100 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
        <button 
          onClick={() => swipe('right')}
          disabled={isLoading}
          className="w-20 h-20 rounded-[2.2rem] bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all shadow-primary/30 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
        </button>
      </div>

      {/* Background Decoration */}
      <div className="fixed top-1/2 -right-12 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none z-0">
        <span className="text-[20rem] font-black text-primary italic tracking-tighter">PUPY爪住</span>
      </div>
    </div>
  );
}