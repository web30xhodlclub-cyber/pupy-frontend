import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { productAPI } from '../services/api';
import WalkingService from './WalkingService';

interface Service {
  id: string;
  name: string;
  price: string;
  priceValue?: number;
  rating: string;
  image: string;
  tags: string[];
  seller?: {
    name: string;
    avatar: string;
    bio?: string;
  };
  availability?: string[];
}

export default function Market() {
  const [activeTab, setActiveTab] = useState<'walking' | 'breeding' | 'products'>('walking');
  const [walkingServices, setWalkingServices] = useState<Service[]>([]);
  const [breedingServices, setBreedingServices] = useState<Service[]>([]);
  const [showWalkingForm, setShowWalkingForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载服务列表
  useEffect(() => {
    loadServices();
  }, [activeTab]);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (activeTab === 'walking') {
        const result = await productAPI.getWalkingServices();
        if (result.success && result.data) {
          setWalkingServices(result.data);
        } else {
          // 使用默认数据
          setWalkingServices(getDefaultWalkingServices());
        }
      } else if (activeTab === 'breeding') {
        const result = await productAPI.getBreedingServices();
        if (result.success && result.data) {
          setBreedingServices(result.data);
        } else {
          setBreedingServices(getDefaultBreedingServices());
        }
      }
    } catch (err) {
      console.error('加载服务失败:', err);
      // 使用默认数据
      if (activeTab === 'walking') {
        setWalkingServices(getDefaultWalkingServices());
      } else {
        setBreedingServices(getDefaultBreedingServices());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultWalkingServices = (): Service[] => [
    {
      id: 'w-1',
      name: '小美遛狗服务',
      price: '¥10/5分钟',
      priceValue: 10,
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      tags: ['艺术生', '爱狗狗', '3年经验'],
      seller: {
        name: '小美',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
        bio: '艺术生，特别喜欢狗狗，本周三-周五全天有空'
      },
      availability: ['周三 全天', '周四 全天', '周五 全天']
    },
    {
      id: 'w-2',
      name: '阿杰专业遛狗',
      price: '¥15/5分钟',
      priceValue: 15,
      rating: '5.0',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      tags: ['专业训犬师', '大型犬', '有驾照'],
      seller: {
        name: '阿杰',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
        bio: '专业训犬师，擅长大型犬，有丰富经验'
      },
      availability: ['周一 上午', '周一 下午', '周六 全天']
    },
    {
      id: 'w-3',
      name: '萌萌遛狗服务',
      price: '¥8/5分钟',
      priceValue: 8,
      rating: '4.7',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      tags: ['学生优惠', '细心', '准时'],
      seller: {
        name: '萌萌',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
        bio: '大学生，时间灵活，对宠物有耐心'
      },
      availability: ['周二 全天', '周三 下午', '周日 全天']
    }
  ];

  const getDefaultBreedingServices = (): Service[] => [
    {
      id: 'b-1',
      name: '金毛寻回犬',
      price: '¥2,500',
      priceValue: 2500,
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
      tags: ['血统纯正', '健康检查', '专业护理'],
      seller: {
        name: '小王',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
      }
    },
    {
      id: 'b-2',
      name: '边境牧羊犬',
      price: '¥3,200',
      priceValue: 3200,
      rating: '5.0',
      image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=400',
      tags: ['高智商', '冠军后代', '性格温顺'],
      seller: {
        name: '李哥',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
      }
    },
    {
      id: 'b-3',
      name: '柴犬',
      price: '¥4,500',
      priceValue: 4500,
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400',
      tags: ['网红同款', '双血统', '包邮'],
      seller: {
        name: '阿康',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
      }
    }
  ];

  const currentServices = activeTab === 'walking' ? walkingServices : breedingServices;

  return (
    <div className="px-6 space-y-6 pb-10">
      <section className="text-center space-y-2">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary italic">集市</h1>
        <p className="text-slate-500 font-medium tracking-tight">发现优质宠物服务</p>
      </section>

      {/* Tab Switcher */}
      <div className="flex justify-center p-1 bg-slate-100 rounded-[2rem] max-w-[400px] mx-auto">
        <button 
          onClick={() => setActiveTab('walking')}
          className={`flex-1 py-3 rounded-[1.8rem] text-xs font-black transition-all ${activeTab === 'walking' ? 'bg-white text-primary shadow-lg' : 'text-slate-400'}`}
        >
          🐕 帮忙溜溜
        </button>
        <button 
          onClick={() => setActiveTab('breeding')}
          className={`flex-1 py-3 rounded-[1.8rem] text-xs font-black transition-all ${activeTab === 'breeding' ? 'bg-white text-primary shadow-lg' : 'text-slate-400'}`}
        >
          💕 宠物恋爱
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-3 rounded-[1.8rem] text-xs font-black transition-all ${activeTab === 'products' ? 'bg-white text-primary shadow-lg' : 'text-slate-400'}`}
        >
          🛒 宠物用品
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative h-40 rounded-[2.5rem] overflow-hidden shadow-lg">
        <img 
          src={activeTab === 'walking' 
            ? 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800' 
            : 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800'
          } 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
          <h2 className="text-2xl font-black font-headline">
            {activeTab === 'walking' ? '🐕 帮忙溜溜' : '💕 宠物恋爱'}
          </h2>
          <p className="text-sm text-white/80 mt-1">
            {activeTab === 'walking' 
              ? '专业遛狗服务，让你的宠物快乐每一天' 
              : '寻找完美的繁育伴侣'}
          </p>
        </div>
      </div>

      {/* Publish Button */}
      <button 
        onClick={() => setShowWalkingForm(true)}
        className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
      >
        <span className="material-symbols-outlined">add_circle</span>
        发布{activeTab === 'walking' ? '遛狗服务' : '繁育服务'}
      </button>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Services Grid */}
      <div className="grid gap-4">
        <AnimatePresence mode="wait">
          {currentServices.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex gap-4"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-slate-900 text-base truncate">{service.name}</h4>
                  <div className="flex items-center gap-1 text-orange-400 flex-shrink-0">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-xs font-black">{service.rating}</span>
                  </div>
                </div>

                {service.seller && (
                  <div className="flex items-center gap-2 mt-1">
                    <img src={service.seller.avatar} alt="" className="w-5 h-5 rounded-full" />
                    <span className="text-xs text-slate-500">{service.seller.name}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mt-2">
                  {service.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-bold rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                {service.availability && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {service.availability.map(slot => (
                      <span key={slot} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded-md">
                        {slot}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-end mt-2">
                  <span className="text-emerald-500 font-black text-lg">{service.price}</span>
                  <button className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center active:scale-90 transition-transform">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {!isLoading && currentServices.length === 0 && (
        <div className="text-center py-10 space-y-4">
          <span className="material-symbols-outlined text-5xl text-slate-300">inventory_2</span>
          <p className="text-slate-400">暂无{activeTab === 'walking' ? '遛狗服务' : '繁育服务'}</p>
          <button 
            onClick={() => setShowWalkingForm(true)}
            className="px-6 py-3 bg-primary text-white rounded-2xl font-bold"
          >
            成为第一个发布者
          </button>
        </div>
      )}

      {/* Walking Service Form */}
      {showWalkingForm && (
        <WalkingService onClose={() => setShowWalkingForm(false)} />
      )}
    </div>
  );
}