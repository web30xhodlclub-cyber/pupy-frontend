import { motion } from 'motion/react';
import { useState, useRef } from 'react';
import { productAPI, uploadAPI } from '../services/api';

interface BreedingProps {
  onBack: () => void;
}

interface BreedingService {
  id: string;
  name: string;
  price: string;
  rating: string;
  image: string;
  tags: string[];
  priceValue?: number;
  paymentType?: string;
}

export default function Breeding({ onBack }: BreedingProps) {
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [breedingDetails, setBreedingDetails] = useState({
    petImage: null as string | null,
    breed: '',
    age: '',
    price: '399', // 默认399元/次
    paymentType: 'full', // full: 全额, aa: AA制, other: 对方支付
    description: '',
    tags: [] as string[],
  });

  const [error, setError] = useState<string | null>(null);

  // 预定义的标签选项
  const tagOptions = ['血统纯正', '健康检查', '专业护理', '双血统', '冠军后代', '网红同款', '包邮', '性格温顺'];

  // 繁育服务示例数据
  const breedingServices: BreedingService[] = [
    {
      id: '1',
      name: '金毛寻回犬',
      price: '¥2,500',
      priceValue: 2500,
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
      tags: ['血统纯正', '健康检查', '专业护理'],
      paymentType: 'full'
    },
    {
      id: '2',
      name: '边境牧羊犬',
      price: '¥3,200',
      priceValue: 3200,
      rating: '5.0',
      image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=400',
      tags: ['高智商', '冠军后代', '性格温顺'],
      paymentType: 'aa'
    },
    {
      id: '3',
      name: '柴犬',
      price: '¥4,500',
      priceValue: 4500,
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400',
      tags: ['网红同款', '双血统', '包邮'],
      paymentType: 'other'
    }
  ];

  // 处理图片上传
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(30);
      
      // 先使用 FileReader 预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setBreedingDetails(prev => ({ ...prev, petImage: e.target?.result as string }));
        setUploadProgress(100);
      };
      reader.readAsDataURL(file);

      // 同时尝试上传到服务器
      try {
        const result = await uploadAPI.uploadImage(file);
        if (result.url) {
          setBreedingDetails(prev => ({ ...prev, petImage: result.url }));
        }
      } catch {
        // 上传失败时使用本地预览
        console.log('使用本地图片预览');
      }
    } catch (err) {
      setError('图片上传失败');
    }
  };

  // 发布繁育服务
  const handlePublish = async () => {
    if (!breedingDetails.breed || !breedingDetails.age) {
      setError('请填写宠物品种和年龄');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await productAPI.publishBreedingService({
        petId: 'new-pet-' + Date.now(),
        petImage: breedingDetails.petImage || undefined,
        breed: breedingDetails.breed,
        age: parseInt(breedingDetails.age),
        price: parseFloat(breedingDetails.price) || 399,
        paymentType: breedingDetails.paymentType as 'full' | 'aa' | 'other',
        description: breedingDetails.description,
        tags: breedingDetails.tags
      });

      if (result.success) {
        alert('繁育服务发布成功！');
        setShowDetailsForm(false);
        setBreedingDetails({
          petImage: null,
          breed: '',
          age: '',
          price: '399',
          paymentType: 'full',
          description: '',
          tags: []
        });
      } else {
        setError(result.message || '发布失败');
      }
    } catch (err: any) {
      console.error('发布繁育服务失败:', err);
      setError(err.message || '发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 获取支付方式描述
  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'full': return '全额支付';
      case 'aa': return 'AA制';
      case 'other': return '对方支付';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-surface flex flex-col max-w-md mx-auto overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-4 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-50">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-xl font-black font-headline text-slate-900 tracking-tight">繁育服务</h2>
      </header>

      {/* Hero Section */}
      <div className="px-6 py-8">
        <div className="bg-emerald-500 rounded-[3rem] p-8 text-white space-y-4 relative overflow-hidden shadow-2xl shadow-emerald-200">
          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl font-black font-headline leading-tight">寻找完美的 <br /> 繁育伴侣</h1>
            <p className="text-emerald-100 text-sm font-medium">专业血统认证，全方位健康保障</p>
            <p className="text-emerald-200 text-xs mt-1">单次配种服务收费: ¥399/次</p>
          </div>
          <button className="relative z-10 px-6 py-3 bg-white text-emerald-600 rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-transform">
            立即咨询
          </button>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl" />
        </div>
      </div>

      {/* Services List */}
      <div className="px-6 space-y-6 pb-10">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">推荐服务</h3>
          <button className="text-xs font-bold text-emerald-500">查看全部</button>
        </div>

        <div className="grid gap-6">
          {breedingServices.map((service) => (
            <motion.div 
              key={service.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 flex gap-4"
            >
              <div className="w-28 h-28 rounded-3xl overflow-hidden bg-slate-50">
                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-slate-900 text-lg">{service.name}</h4>
                    <div className="flex items-center gap-1 text-orange-400">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-black">{service.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-bold rounded-md uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-emerald-500 font-black text-lg">{service.price}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {getPaymentTypeLabel(service.paymentType || 'full')}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center active:scale-90 transition-transform">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 发布服务按钮 */}
        <div className="px-6 py-4 border-t border-slate-50">
          <button 
            onClick={() => setShowDetailsForm(true)}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add_circle</span>
            发布我的繁育服务
          </button>
        </div>
      </div>

      {/* 发布表单 Modal */}
      {showDetailsForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm max-w-md mx-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] p-8 max-w-sm w-full mx-4 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">发布繁育服务</h3>
              <button onClick={() => setShowDetailsForm(false)} className="p-2 text-slate-400 hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-red-600 text-sm">
                {error}
              </div>
            )}
            
            {/* 宠物照片上传 */}
            <div>
              <label className="text-sm font-bold text-slate-600 mb-2 block">宠物照片 *</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-primary cursor-pointer hover:bg-slate-50 transition-all"
              >
                {breedingDetails.petImage ? (
                  <img src={breedingDetails.petImage} alt="宠物照片" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="material-symbols-outlined text-4xl text-slate-300">add_a_photo</span>
                    <p className="text-xs text-slate-400 mt-2">点击上传照片</p>
                  </div>
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600 mb-2 block">宠物品种 *</label>
              <input 
                type="text"
                value={breedingDetails.breed}
                onChange={(e) => setBreedingDetails({...breedingDetails, breed: e.target.value})}
                placeholder="例如: 金毛寻回犬"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600 mb-2 block">宠物年龄 *</label>
              <input 
                type="text"
                value={breedingDetails.age}
                onChange={(e) => setBreedingDetails({...breedingDetails, age: e.target.value})}
                placeholder="例如: 3岁"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600 mb-2 block">
                配种费用 (元/次)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">¥</span>
                <input 
                  type="number"
                  value={breedingDetails.price}
                  onChange={(e) => setBreedingDetails({...breedingDetails, price: e.target.value})}
                  placeholder="399"
                  className="w-full pl-8 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">建议: 单次配种服务收费为 399元/次</p>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600 mb-3 block">支付方式 *</label>
              <div className="space-y-2">
                {[
                  { value: 'full', label: '💰 全额支付', desc: '我承担全部配种费用' },
                  { value: 'aa', label: '🤝 AA制', desc: '双方平分配种费用' },
                  { value: 'other', label: '🆓 对方支付', desc: '期望对方支付配种费用' }
                ].map(option => (
                  <button 
                    key={option.value}
                    onClick={() => setBreedingDetails({...breedingDetails, paymentType: option.value})}
                    className={`w-full text-left p-3 rounded-2xl border-2 transition-all ${
                      breedingDetails.paymentType === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-primary/50'
                    }`}
                  >
                    <p className="font-bold">{option.label}</p>
                    <p className="text-xs text-slate-500">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600 mb-2 block">标签</label>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      const newTags = breedingDetails.tags.includes(tag)
                        ? breedingDetails.tags.filter(t => t !== tag)
                        : [...breedingDetails.tags, tag];
                      setBreedingDetails({...breedingDetails, tags: newTags});
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      breedingDetails.tags.includes(tag)
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <textarea 
              value={breedingDetails.description}
              onChange={(e) => setBreedingDetails({...breedingDetails, description: e.target.value})}
              placeholder="备注信息 (例如: 血统证明、性格特点等)"
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 resize-none"
            />

            <div className="grid grid-cols-2 gap-3 pt-4">
              <button 
                onClick={() => {
                  setShowDetailsForm(false);
                  setError(null);
                }}
                className="py-3 rounded-2xl border-2 border-slate-200 font-bold text-slate-600"
              >
                取消
              </button>
              <button 
                onClick={handlePublish}
                disabled={isSubmitting || !breedingDetails.breed || !breedingDetails.age}
                className="py-3 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '发布中...' : '发布'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}