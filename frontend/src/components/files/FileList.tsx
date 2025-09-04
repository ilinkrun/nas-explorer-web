import { useState } from 'react';
import { Grid, List, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useFilesStore } from '@/stores/files-store';
import FileGrid from './FileGrid';
import FileListView from './FileListView';

export default function FileList() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { 
    files, 
    isLoading, 
    sortBy, 
    setSortBy,
    sortOrder,
    setSortOrder,
  } = useFilesStore();

  const handleSortChange = (value: string) => {
    setSortBy(value as any);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">파일 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[140px]">
                <SortAsc className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">이름</SelectItem>
                <SelectItem value="size">크기</SelectItem>
                <SelectItem value="modified">수정일</SelectItem>
                <SelectItem value="type">유형</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSortOrder}
              className="px-2"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>
        
        <ToggleGroup
          type="single" 
          value={viewMode} 
          onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}
        >
          <ToggleGroupItem value="grid" aria-label="그리드 보기">
            <Grid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="목록 보기">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto">
        {files.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground text-lg mb-2">폴더가 비어있습니다</p>
              <p className="text-muted-foreground text-sm">
                새 폴더를 만들거나 파일을 업로드해보세요
              </p>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? <FileGrid /> : <FileListView />}
          </>
        )}
      </div>
    </div>
  );
}