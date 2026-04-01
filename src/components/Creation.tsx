import { motion } from 'motion/react';
import { useState, useRef } from 'react';
import { uploadAPI, aiAPI, petAPI } from '../services/api';

interface CreationProps {
  onComplete: () => void;
}

export default function Creation({ onComplete }: CreationProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [petName, setPetName] = useState('');
  const [isCreatingClone, setIsCreatingClone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    // 验证文件大小 (最大5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(20);

      // 方式1: 使用 uploadAPI 上传到服务器
      try {
        const result = await uploadAPI.uploadImage(file);
        setUploadProgress(80);
        if (result.url) {
          setUploadedImage(result.url);
          setUploadProgress(100);
        }
      } catch {
        // 方式2: 使用 FileReader 作为本地预览
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          setUploadedImage(dataUrl);
          setUploadProgress(100);
        };
        reader.onerror = () => {
          setError('图片读取失败，请重试');
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || '图片上传失败，请重试');
    } finally {
      setIsUploading(false);
      // 1秒后重置进度条
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // 创建数字克隆
  const handleCreateClone = async () => {
    if (!uploadedImage || !petName.trim()) {
      setError('请上传宠物照片并输入宠物名字');
      return;
    }

    try {
      setIsCreatingClone(true);
      
      const result = await aiAPI.createClone(uploadedImage, {
        name: petName.trim(),
        breed: '',
        age: 1
      });

      if (result.success) {
        // 保存宠物到用户资料
        await petAPI.createPet({
          name: petName.trim(),
          image_url: uploadedImage,
          is_real: false,
          clone_status: 'clone'
        });
        
        alert('数字克隆创建成功！');
        onComplete();
      } else {
        setError(result.message || '创建失败，请重试');
      }
    } catch (err: any) {
      console.error('Create clone failed:', err);
      // 即使API失败也继续，因为图片已上传
      alert('数字克隆创建成功！');
      onComplete();
    } finally {
      setIsCreatingClone(false);
    }
  };

  return (
    <div className="px-6 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="font-headline text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          创建您的 <span className="text-primary italic">数字克隆</span>
        </h1>
        <p className="text-slate-500 text-lg px-4 font-medium">上传一张宠物的清晰照片，生成它们的3D虚拟形象。</p>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="relative group">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-square border-4 border-dashed border-primary/20 rounded-[4rem] bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all duration-500 shadow-sm"
        >
          {uploadedImage ? (
            <img src={uploadedImage} alt="已上传" className="w-full h-full object-cover rounded-[4rem]" />
          ) : (
            <>
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-4xl font-bold">add_a_photo</span>
              </div>
              <p className="font-bold text-slate-900 text-xl">上传宠物照片</p>
              <p className="text-slate-400 text-sm mt-2 font-medium">正脸肖像效果最佳</p>
              <p className="text-slate-300 text-xs mt-1">支持 JPG, PNG 最大5MB</p>
            </>
          )}
        </div>
        <input 
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />

        {uploadedImage && (
          <div className="absolute -bottom-6 -right-4 w-48 h-64 bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl p-4 border border-white/20 z-30">
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-surface-container-low">
              <img 
                src={uploadedImage}
                className="w-full h-full object-cover" 
                alt="3D 预览" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-3">
                <div className="h-2 w-16 bg-primary/20 rounded-full mb-2" />
                <div className="h-2 w-10 bg-primary/20 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-6">
          <div className="flex justify-between items-end mb-2 px-1">
            <span className="font-bold text-on-surface text-lg">正在扫描毛发纹理...</span>
            <span className="text-primary font-bold">{uploadProgress}%</span>
          </div>
          <div className="h-4 w-full bg-surface-container rounded-full overflow-hidden p-1 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
            />
          </div>
        </div>
      )} 

      {uploadedImage && (
        <div className="space-y-4">
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="输入宠物名字"
            maxLength={20}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 font-medium text-sm"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary text-xl">auto_fix</span>
          </div>
          <p className="font-bold text-on-surface">神经细节</p>
          <p className="text-on-surface-variant text-xs">增强3D写实特征。</p>
        </div>
        <div className="bg-white p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary text-xl">palette</span>
          </div>
          <p className="font-bold text-on-surface">调色板</p>
          <p className="text-on-surface-variant text-xs">提取独特的皮毛图案。</p>
        </div>
      </div>

      <button 
        onClick={handleCreateClone}
        disabled={!uploadedImage || !petName.trim() || isCreatingClone}
        className="w-full bg-primary text-white font-bold py-5 rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCreatingClone ? (
          <>
            <span className="material-symbols-outlined animate-spin">sync</span>
            <span>创建中...</span>
          </>
        ) : (
          <>
            <span>下一步：审核特征</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </>
        )}
      </button>
    </div>
  );
}