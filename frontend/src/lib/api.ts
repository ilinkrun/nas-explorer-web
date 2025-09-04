const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:11331/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: string;
  };
}

export interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  size: number;
  mimeType: string;
  modifiedAt: string;
  permissions: string[];
  isDirectory: boolean;
  thumbnail?: string;
}

export interface FilesResponse {
  items: FileItem[];
  total: number;
  hasMore: boolean;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  // Auth APIs
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.request<null>('/auth/logout', {
      method: 'POST',
    });
  }

  async getMe(): Promise<ApiResponse<LoginResponse['user']>> {
    return this.request<LoginResponse['user']>('/auth/me');
  }

  // Files APIs
  async getFiles(params: {
    path?: string;
    sort?: string;
    order?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<FilesResponse>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    return this.request<FilesResponse>(`/files?${searchParams.toString()}`);
  }

  async downloadFile(path: string): Promise<Blob> {
    const url = `${API_BASE_URL}/files/download?path=${encodeURIComponent(path)}`;
    const response = await fetch(url, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    return response.blob();
  }

  async uploadFiles(files: File[], path: string = '/'): Promise<ApiResponse<FileItem[]>> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('path', path);

    return this.request<FileItem[]>('/files/upload', {
      method: 'POST',
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      body: formData,
    });
  }

  async createFolder(path: string, name: string): Promise<ApiResponse<FileItem>> {
    return this.request<FileItem>('/files/folder', {
      method: 'POST',
      body: JSON.stringify({ path, name }),
    });
  }

  async deleteFiles(paths: string[]): Promise<ApiResponse<null>> {
    return this.request<null>('/files', {
      method: 'DELETE',
      body: JSON.stringify({ paths }),
    });
  }

  async moveFile(sourcePath: string, destinationPath: string): Promise<ApiResponse<null>> {
    return this.request<null>('/files/move', {
      method: 'PUT',
      body: JSON.stringify({ sourcePath, destinationPath }),
    });
  }

  async copyFile(sourcePath: string, destinationPath: string): Promise<ApiResponse<null>> {
    return this.request<null>('/files/copy', {
      method: 'POST',
      body: JSON.stringify({ sourcePath, destinationPath }),
    });
  }

  async renameFile(path: string, newName: string): Promise<ApiResponse<null>> {
    return this.request<null>('/files/rename', {
      method: 'PUT',
      body: JSON.stringify({ path, newName }),
    });
  }
}

export const apiClient = new ApiClient();