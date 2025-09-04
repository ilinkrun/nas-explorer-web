import { create } from 'zustand';
import { type FileItem } from '@/lib/api';

interface FilesState {
  currentPath: string;
  files: FileItem[];
  selectedFiles: string[];
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'size' | 'modified' | 'type';
  sortOrder: 'asc' | 'desc';
  isLoading: boolean;

  // Actions
  setCurrentPath: (path: string) => void;
  setFiles: (files: FileItem[]) => void;
  setSelectedFiles: (fileIds: string[]) => void;
  toggleFileSelection: (fileId: string) => void;
  clearSelection: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sortBy: FilesState['sortBy']) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setLoading: (loading: boolean) => void;
}

export const useFilesStore = create<FilesState>((set, get) => ({
  currentPath: '/',
  files: [],
  selectedFiles: [],
  viewMode: 'grid',
  sortBy: 'name',
  sortOrder: 'asc',
  isLoading: false,

  setCurrentPath: (path: string) => set({ currentPath: path }),
  
  setFiles: (files: FileItem[]) => set({ files }),
  
  setSelectedFiles: (fileIds: string[]) => set({ selectedFiles: fileIds }),
  
  toggleFileSelection: (fileId: string) => {
    const { selectedFiles } = get();
    const isSelected = selectedFiles.includes(fileId);
    
    if (isSelected) {
      set({ selectedFiles: selectedFiles.filter(id => id !== fileId) });
    } else {
      set({ selectedFiles: [...selectedFiles, fileId] });
    }
  },
  
  clearSelection: () => set({ selectedFiles: [] }),
  
  setViewMode: (mode: 'grid' | 'list') => set({ viewMode: mode }),
  
  setSortBy: (sortBy: FilesState['sortBy']) => set({ sortBy }),
  
  setSortOrder: (order: 'asc' | 'desc') => set({ sortOrder: order }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));