import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { apiClient } from '@/lib/api';
import { useFilesStore } from '@/stores/files-store';
import FileToolbar from '@/components/files/FileToolbar';
import FileBreadcrumb from '@/components/files/FileBreadcrumb';
import FileList from '@/components/files/FileList';
import { useToast } from '@/components/ui/use-toast';

export default function FilesPage() {
  const location = useLocation();
  const { toast } = useToast();
  const {
    currentPath,
    setCurrentPath,
    setFiles,
    setLoading,
    sortBy,
    sortOrder,
  } = useFilesStore();

  // Extract path from URL
  const urlPath = location.pathname.replace('/files', '') || '/';
  
  useEffect(() => {
    if (urlPath !== currentPath) {
      setCurrentPath(urlPath);
    }
  }, [urlPath, currentPath, setCurrentPath]);

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['files', currentPath, sortBy, sortOrder],
    queryFn: () => apiClient.getFiles({
      path: currentPath,
      sort: sortBy,
      order: sortOrder,
    }),
    enabled: !!currentPath,
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (data?.success && data.data) {
      setFiles(data.data.items);
    }
  }, [data, setFiles]);

  useEffect(() => {
    if (error) {
      toast({
        title: '파일 로드 오류',
        description: error instanceof Error ? error.message : '파일 목록을 불러올 수 없습니다.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 space-y-4">
        <FileToolbar />
        <FileBreadcrumb />
      </div>
      
      <div className="flex-1 overflow-hidden">
        <FileList />
      </div>
    </div>
  );
}