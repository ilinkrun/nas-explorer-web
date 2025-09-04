import { useNavigate } from 'react-router-dom';
import { useFilesStore } from '@/stores/files-store';
import { formatFileSize, formatDate, getFileIcon } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Folder } from 'lucide-react';

export default function FileListView() {
  const navigate = useNavigate();
  const { files, selectedFiles, toggleFileSelection, currentPath } = useFilesStore();

  const handleFileClick = (file: any) => {
    if (file.type === 'folder') {
      const newPath = currentPath === '/' 
        ? `/${file.name}` 
        : `${currentPath}/${file.name}`;
      navigate(`/files${newPath}`);
    } else {
      // Handle file open/preview
      console.log('Open file:', file);
    }
  };

  const handleFileSelect = (fileId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    toggleFileSelection(fileId);
  };

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-1"></div> {/* Checkbox column */}
        <div className="col-span-6">이름</div>
        <div className="col-span-2">크기</div>
        <div className="col-span-3">수정일</div>
      </div>

      {/* Files */}
      {files.map((file) => {
        const isSelected = selectedFiles.includes(file.id);
        
        return (
          <div
            key={file.id}
            className={cn(
              'grid grid-cols-12 gap-4 px-4 py-2 rounded-lg cursor-pointer transition-colors hover:bg-muted/50',
              isSelected && 'bg-primary/5 border border-primary/20'
            )}
            onClick={() => handleFileClick(file)}
          >
            {/* Checkbox */}
            <div className="col-span-1 flex items-center">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => {
                  if (checked) {
                    toggleFileSelection(file.id);
                  } else {
                    toggleFileSelection(file.id);
                  }
                }}
                onClick={(e) => handleFileSelect(file.id, e)}
              />
            </div>

            {/* Name with icon */}
            <div className="col-span-6 flex items-center space-x-3 min-w-0">
              <div className="flex-shrink-0 text-xl">
                {file.type === 'folder' ? (
                  <Folder className="h-5 w-5 text-primary" />
                ) : (
                  <span className="text-base">{getFileIcon(file.mimeType)}</span>
                )}
              </div>
              <span className="text-sm font-medium text-foreground truncate">
                {file.name}
              </span>
            </div>

            {/* Size */}
            <div className="col-span-2 flex items-center">
              <span className="text-sm text-muted-foreground">
                {file.type === 'file' ? formatFileSize(file.size) : '—'}
              </span>
            </div>

            {/* Modified date */}
            <div className="col-span-3 flex items-center">
              <span className="text-sm text-muted-foreground">
                {formatDate(file.modifiedAt)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}