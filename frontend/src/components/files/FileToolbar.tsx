import { Plus, Upload, Download, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFilesStore } from '@/stores/files-store';
import { useToast } from '@/components/ui/use-toast';

export default function FileToolbar() {
  const { selectedFiles, clearSelection } = useFilesStore();
  const { toast } = useToast();

  const handleNewFolder = () => {
    toast({
      title: '새 폴더',
      description: '새 폴더 생성 기능은 개발 중입니다.',
    });
  };

  const handleUpload = () => {
    toast({
      title: '파일 업로드',
      description: '파일 업로드 기능은 개발 중입니다.',
    });
  };

  const handleDownload = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: '선택된 파일 없음',
        description: '다운로드할 파일을 선택해주세요.',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: '다운로드',
      description: '다운로드 기능은 개발 중입니다.',
    });
  };

  const handleDelete = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: '선택된 파일 없음',
        description: '삭제할 파일을 선택해주세요.',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: '삭제',
      description: '삭제 기능은 개발 중입니다.',
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button onClick={handleNewFolder} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          새 폴더
        </Button>
        
        <Button onClick={handleUpload} variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          업로드
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        {selectedFiles.length > 0 && (
          <>
            <span className="text-sm text-muted-foreground">
              {selectedFiles.length}개 항목 선택됨
            </span>
            
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              다운로드
            </Button>
            
            <Button 
              onClick={handleDelete} 
              variant="outline" 
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              삭제
            </Button>

            <Button onClick={clearSelection} variant="ghost" size="sm">
              선택 해제
            </Button>
          </>
        )}
        
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}