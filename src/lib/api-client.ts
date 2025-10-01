// API client utilities for dashboard
import {
  APIResponse,
  PaginatedResponse,
  ProjectWithSlides,
  ProjectSlide,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateSlideRequest,
  UpdateSlideRequest,
  FileUploadResponse,
  DashboardAuth,
  ProjectCategory,
  ContactMessage,
  CreateContactMessageRequest,
  UpdateContactMessageRequest,
  ContactMessageStatus,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from './types';

console.log('🌐 API client loaded - ready to communicate with backend like a diplomatic translator!');

const API_BASE = '/api';

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  console.log('📡 API call:', options.method || 'GET', endpoint);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json() as APIResponse<T>;

    if (!response.ok) {
      console.error('❌ API error:', response.status, data.error);
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    console.log('✅ API success:', endpoint, data.success ? 'OK' : 'FAILED');
    return data;
  } catch (error) {
    console.error('❌ API call failed:', endpoint, error);
    throw error;
  }
}

// Generic FormData API call function
async function apiCallFormData<T>(
  endpoint: string,
  formData: FormData,
  method: 'POST' | 'PUT' = 'POST'
): Promise<APIResponse<T>> {
  console.log('📤 FormData API call:', method, endpoint);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      body: formData,
    });

    const data = await response.json() as APIResponse<T>;

    if (!response.ok) {
      console.error('❌ FormData API error:', response.status, data.error);
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    console.log('✅ FormData API success:', endpoint);
    return data;
  } catch (error) {
    console.error('❌ FormData API call failed:', endpoint, error);
    throw error;
  }
}

// Authentication API
export const authAPI = {
  async login(username: string, password: string): Promise<DashboardAuth> {
    const response = await apiCall<DashboardAuth>('/auth', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return response.data!;
  },

  async checkAuth(token?: string): Promise<DashboardAuth> {
    const endpoint = token ? `/auth?token=${token}` : '/auth';
    const response = await apiCall<DashboardAuth>(endpoint);
    return response.data!;
  },

  async logout(): Promise<void> {
    await apiCall('/auth', { method: 'DELETE' });
  },
};

// Projects API
export const projectsAPI = {
  async getAll(params: {
    categoryId?: number;
    page?: number;
    limit?: number;
  } = {}): Promise<PaginatedResponse<ProjectWithSlides>['data']> {
    const searchParams = new URLSearchParams();
    if (params.categoryId) searchParams.set('categoryId', params.categoryId.toString());
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());

    const endpoint = `/projects${searchParams.toString() ? `?${searchParams}` : ''}`;
    const response = await apiCall<PaginatedResponse<ProjectWithSlides>['data']>(endpoint);
    return response.data!;
  },

  async getById(id: string): Promise<ProjectWithSlides> {
    const response = await apiCall<ProjectWithSlides>(`/projects/${id}`);
    return response.data!;
  },

  async create(data: CreateProjectRequest): Promise<ProjectWithSlides> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('clientName', data.clientName);
    if (data.clientLogoFile) formData.append('clientLogoFile', data.clientLogoFile);
    formData.append('tags', JSON.stringify(data.tags));
    formData.append('categoryId', data.categoryId.toString());
    formData.append('projectType', data.projectType);
    if (data.dateFinished) formData.append('dateFinished', data.dateFinished);
    if (data.extraFields) formData.append('extraFields', JSON.stringify(data.extraFields));
    if (data.thumbnailFile) formData.append('thumbnailFile', data.thumbnailFile);
    if (data.iconBarBgColor) formData.append('iconBarBgColor', data.iconBarBgColor);
    if (data.iconBarIconColor) formData.append('iconBarIconColor', data.iconBarIconColor);

    const response = await apiCallFormData<ProjectWithSlides>('/projects', formData, 'POST');
    return response.data!;
  },

  async update(id: string, data: Partial<CreateProjectRequest>): Promise<ProjectWithSlides> {
    console.log('🎨 API Client - Updating project with colors:', {
      iconBarBgColor: data.iconBarBgColor,
      iconBarIconColor: data.iconBarIconColor
    });
    
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.title) formData.append('title', data.title);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.clientName) formData.append('clientName', data.clientName);
    if (data.clientLogoFile) formData.append('clientLogoFile', data.clientLogoFile);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.categoryId) formData.append('categoryId', data.categoryId.toString());
    if (data.projectType) formData.append('projectType', data.projectType);
    if (data.dateFinished !== undefined) formData.append('dateFinished', data.dateFinished);
    if (data.extraFields) formData.append('extraFields', JSON.stringify(data.extraFields));
    if (data.thumbnailFile) formData.append('thumbnailFile', data.thumbnailFile);
    if (data.iconBarBgColor) {
      console.log('✅ Adding iconBarBgColor to formData:', data.iconBarBgColor);
      formData.append('iconBarBgColor', data.iconBarBgColor);
    }
    if (data.iconBarIconColor) {
      console.log('✅ Adding iconBarIconColor to formData:', data.iconBarIconColor);
      formData.append('iconBarIconColor', data.iconBarIconColor);
    }

    const response = await apiCallFormData<ProjectWithSlides>(`/projects/${id}`, formData, 'PUT');
    return response.data!;
  },

  async delete(id: string): Promise<void> {
    await apiCall(`/projects/${id}`, { method: 'DELETE' });
  },
};

// Slides API
export const slidesAPI = {
  async getByProjectId(projectId: string): Promise<ProjectSlide[]> {
    const response = await apiCall<ProjectSlide[]>(`/slides?projectId=${projectId}`);
    return response.data!;
  },

  async getById(id: string): Promise<ProjectSlide> {
    const response = await apiCall<ProjectSlide>(`/slides/${id}`);
    return response.data!;
  },

  async create(data: CreateSlideRequest): Promise<ProjectSlide> {
    const formData = new FormData();
    formData.append('projectId', data.projectId);
    formData.append('order', data.order.toString());
    formData.append('type', data.type);
    if (data.text) formData.append('text', data.text);
    if (data.mediaFile) formData.append('mediaFile', data.mediaFile);

    const response = await apiCallFormData<ProjectSlide>('/slides', formData, 'POST');
    return response.data!;
  },

  async update(id: string, data: Partial<CreateSlideRequest>): Promise<ProjectSlide> {
    const formData = new FormData();
    if (data.order !== undefined) formData.append('order', data.order.toString());
    if (data.type) formData.append('type', data.type);
    if (data.text !== undefined) formData.append('text', data.text);
    if (data.mediaFile) formData.append('mediaFile', data.mediaFile);

    const response = await apiCallFormData<ProjectSlide>(`/slides/${id}`, formData, 'PUT');
    return response.data!;
  },

  async delete(id: string): Promise<void> {
    await apiCall(`/slides/${id}`, { method: 'DELETE' });
  },
};

// Upload API
export const uploadAPI = {
  async uploadFile(file: File, folder: string = 'uploads'): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await apiCallFormData<FileUploadResponse>('/upload', formData, 'POST');
    return response.data!;
  },

  async deleteFile(key: string): Promise<void> {
    await apiCall(`/upload?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
  },
};

// Contact Messages API
export const contactAPI = {
  async getAll(params: {
    status?: ContactMessageStatus;
    page?: number;
    limit?: number;
  } = {}): Promise<PaginatedResponse<ContactMessage>['data']> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set('status', params.status);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());

    const endpoint = `/contact${searchParams.toString() ? `?${searchParams}` : ''}`;
    const response = await apiCall<PaginatedResponse<ContactMessage>['data']>(endpoint);
    return response.data!;
  },

  async getById(id: string): Promise<ContactMessage> {
    const response = await apiCall<ContactMessage>(`/contact/${id}`);
    return response.data!;
  },

  async create(data: CreateContactMessageRequest): Promise<ContactMessage> {
    const response = await apiCall<ContactMessage>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data!;
  },

  async updateStatus(id: string, status: ContactMessageStatus): Promise<ContactMessage> {
    const response = await apiCall<ContactMessage>(`/contact/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.data!;
  },

  async delete(id: string): Promise<void> {
    await apiCall(`/contact/${id}`, { method: 'DELETE' });
  },
};

// Categories API
export const categoriesAPI = {
  async getAll(): Promise<Category[]> {
    const response = await apiCall<Category[]>('/categories');
    return response.data!;
  },

  async getById(id: number): Promise<Category> {
    const response = await apiCall<Category>(`/categories/${id}`);
    return response.data!;
  },

  async create(data: CreateCategoryRequest): Promise<Category> {
    const response = await apiCall<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data!;
  },

  async update(id: number, data: Omit<UpdateCategoryRequest, 'id'>): Promise<Category> {
    const response = await apiCall<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data!;
  },

  async delete(id: number): Promise<void> {
    await apiCall(`/categories/${id}`, { method: 'DELETE' });
  },
};
