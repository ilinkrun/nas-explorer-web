import { useNavigate } from 'react-router-dom';
import { useFilesStore } from '@/stores/files-store';
import { formatFileSize, formatDate, getFileIcon } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Folder } from 'lucide-react';

export default function FileGrid() {
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
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {files.map((file) => {
        const isSelected = selectedFiles.includes(file.id);
        
        return (
          <div
            key={file.id}
            className={cn(
              'group relative p-3 rounded-lg border-2 border-transparent cursor-pointer transition-all hover:border-primary/20 hover:bg-muted/50',
              isSelected && 'border-primary bg-primary/5'
            )}
            onClick={() => handleFileClick(file)}
          >
            {/* Selection checkbox */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

            {/* File icon */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 text-4xl">
                {file.type === 'folder' ? (
                  <Folder className="h-12 w-12 text-primary" />
                ) : (
                  <span>{getFileIcon(file.mimeType)}</span>
                )}
              </div>

              {/* File name */}
              <p className="text-sm font-medium text-foreground truncate w-full mb-1">
                {file.name}
              </p>

              {/* File info */}
              {file.type === 'file' && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{formatFileSize(file.size)}</p>
                  <p>{formatDate(file.modifiedAt)}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}