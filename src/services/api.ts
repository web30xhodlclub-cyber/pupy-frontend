/**
 * API 服务层 - 统一管理所有后端 API 调用
 * 已修复：所有端点与后端正确对接
 */

const API_BASE_URL = 'http://localhost:3001';
const API_PREFIX = '/api/v1';

// 通用 API 请求函数
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('/health') || endpoint.startsWith('/status') 
    ? `${API_BASE_URL}${endpoint}`
    : `${API_BASE_URL}${API_PREFIX}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 添加认证 token
  const token = localStorage.getItem('pupy_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// ==================== 用户认证相关 ====================
export const authAPI = {
  register: async (email: string, password: string, username: string, name?: string) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username, name }),
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return apiRequest('/auth/logout', { method: 'POST' });
  },
};

// ==================== 用户相关 ====================
export const userAPI = {
  getCurrentUser: async () => {
    return apiRequest('/users/profile/me');
  },

  updateProfile: async (data: any) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getUserStats: async () => {
    return apiRequest('/users/profile/me/stats');
  },

  uploadAvatar: async (avatarUrl: string) => {
    return apiRequest('/users/avatar', {
      method: 'POST',
      body: JSON.stringify({ avatar_url: avatarUrl }),
    });
  },
};

// ==================== 宠物相关 ====================
export const petAPI = {
  getPets: async (params?: { breed?: string; gender?: string; page?: number; limit?: number }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return apiRequest(`/pets${query}`);
  },

  getMyPets: async () => {
    return apiRequest('/pets/my');
  },

  getPetById: async (id: string) => {
    return apiRequest(`/pets/${id}`);
  },

  createPet: async (data: any) => {
    return apiRequest('/pets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updatePet: async (id: string, data: any) => {
    return apiRequest(`/pets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deletePet: async (id: string) => {
    return apiRequest(`/pets/${id}`, { method: 'DELETE' });
  },

  uploadPetImage: async (id: string, imageUrl: string) => {
    return apiRequest(`/pets/${id}/image`, {
      method: 'POST',
      body: JSON.stringify({ image_url: imageUrl }),
    });
  },
};

// ==================== 配对相关 ====================
export const matchAPI = {
  createMatch: async (targetPetId: string, action: 'like' | 'dislike') => {
    return apiRequest('/matches', {
      method: 'POST',
      body: JSON.stringify({ targetPetId, action }),
    });
  },

  getRecommendations: async () => {
    return apiRequest('/matches/recommendations');
  },

  getMatchHistory: async () => {
    return apiRequest('/matches/history');
  },

  getSuccessfulMatches: async () => {
    return apiRequest('/matches/successful');
  },

  getConversation: async (targetPetId: string) => {
    return apiRequest(`/matches/conversation/${targetPetId}`);
  },

  getMatchStats: async () => {
    return apiRequest('/matches/stats');
  },
};

// ==================== 消息相关 ====================
export const messageAPI = {
  getConversations: async () => {
    return apiRequest('/messages');
  },

  getMessages: async (conversationId: string) => {
    return apiRequest(`/messages/${conversationId}/messages`);
  },

  sendMessage: async (conversationId: string, content: string) => {
    return apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify({ conversationId, content }),
    });
  },

  sendMessageToUser: async (recipientId: string, content: string) => {
    return apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify({ recipientId, content }),
    });
  },

  sendPetMessage: async (petId: string, content: string) => {
    return apiRequest('/messages/pet', {
      method: 'POST',
      body: JSON.stringify({ petId, content }),
    });
  },

  markAsRead: async (conversationId: string) => {
    return apiRequest(`/messages/${conversationId}/read`, {
      method: 'PUT',
    });
  },

  getUnreadCount: async () => {
    return apiRequest('/messages/unread/count');
  },

  deleteConversation: async (conversationId: string) => {
    return apiRequest(`/messages/${conversationId}`, { method: 'DELETE' });
  },
};

// ==================== 虚拟领域相关 ====================
export const realmAPI = {
  getRealms: async () => {
    return apiRequest('/realms');
  },

  getRealmById: async (id: string) => {
    return apiRequest(`/realms/${id}`);
  },

  getOnlineUsers: async (realmId: string) => {
    return apiRequest(`/realms/${realmId}/online-users`);
  },

  // 小院儿相关
  createRoom: async (data: {
    name: string;
    map: string;
    roomCode: string;
    roomPassword: string;
    capacity?: number;
  }) => {
    return apiRequest('/realms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  joinRoom: async (roomCode: string, roomPassword: string) => {
    return apiRequest('/realms/rooms/join', {
      method: 'POST',
      body: JSON.stringify({ roomCode, roomPassword }),
    });
  },

  getMyRooms: async () => {
    return apiRequest('/realms/rooms/my');
  },

  getRooms: async () => {
    return apiRequest('/realms/rooms');
  },

  getRoomMembers: async (roomId: string) => {
    return apiRequest(`/realms/rooms/${roomId}/members`);
  },

  leaveRoom: async (roomId: string) => {
    return apiRequest(`/realms/rooms/${roomId}/leave`, {
      method: 'POST',
    });
  },
};

// ==================== 产品相关 ====================
export const productAPI = {
  getProducts: async (category?: string) => {
    const url = category ? `/products?category=${category}` : '/products';
    return apiRequest(url);
  },

  getProductById: async (id: string) => {
    return apiRequest(`/products/${id}`);
  },

  // 遛狗服务
  publishWalkingService: async (data: {
    name: string;
    bio: string;
    availability: string[];
    pricePerSession: number;
    images?: string[];
  }) => {
    return apiRequest('/products/walking', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getWalkingServices: async () => {
    return apiRequest('/products/walking-services/list');
  },

  // 繁育服务
  publishBreedingService: async (data: {
    petId: string;
    petImage?: string;
    breed: string;
    age: number;
    price?: number;
    paymentType?: 'full' | 'aa' | 'other';
    description?: string;
    tags?: string[];
  }) => {
    return apiRequest('/products/breeding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getBreedingServices: async () => {
    return apiRequest('/products/breeding-services/list');
  },

  // 订单
  createOrder: async (productId: string, productType: string, quantity?: number) => {
    return apiRequest('/products/orders', {
      method: 'POST',
      body: JSON.stringify({ productId, productType, quantity }),
    });
  },

  getMyOrders: async () => {
    return apiRequest('/products/orders/my');
  },

  getMyServices: async () => {
    return apiRequest('/products/my-services');
  },

  uploadProductImage: async (url: string, productId: string, productType: string) => {
    return apiRequest('/products/upload', {
      method: 'POST',
      body: JSON.stringify({ url, productId, productType }),
    });
  },
};

// ==================== 日记相关 ====================
export const diaryAPI = {
  getDiaryEntries: async () => {
    return apiRequest('/diary');
  },

  createDiaryEntry: async (data: {
    title: string;
    content: string;
    petId?: string;
    images?: string[];
    mood?: string;
  }) => {
    return apiRequest('/diary', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getDiaryEntry: async (id: string) => {
    return apiRequest(`/diary/${id}`);
  },

  deleteDiaryEntry: async (id: string) => {
    return apiRequest(`/diary/${id}`, { method: 'DELETE' });
  },
};

// ==================== 通知相关 ====================
export const notificationAPI = {
  getNotifications: async () => {
    return apiRequest('/notifications');
  },

  markAsRead: async (notificationId: string) => {
    return apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  markAllAsRead: async () => {
    return apiRequest('/notifications/read-all', {
      method: 'PUT',
    });
  },

  getUnreadCount: async () => {
    return apiRequest('/notifications/unread-count');
  },
};

// ==================== AI 相关 ====================
export const aiAPI = {
  generatePrayer: async (petName: string, context?: string) => {
    return apiRequest('/ai/prayer', {
      method: 'POST',
      body: JSON.stringify({ petName, context }),
    });
  },

  createClone: async (petImage: string, petInfo: any) => {
    return apiRequest('/ai/clone', {
      method: 'POST',
      body: JSON.stringify({ petImage, petInfo }),
    });
  },

  translateMessage: async (text: string, targetLanguage?: string) => {
    return apiRequest('/ai/translate', {
      method: 'POST',
      body: JSON.stringify({ text, targetLanguage }),
    });
  },

  getPrayers: async () => {
    return apiRequest('/ai/prayers');
  },

  getClones: async () => {
    return apiRequest('/ai/clones');
  },
};

// ==================== 文件上传 ====================
export const uploadAPI = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('pupy_token');
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  },

  uploadMultiple: async (files: File[]): Promise<{ urls: string[] }> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const token = localStorage.getItem('pupy_token');
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/upload/multiple`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  },
};