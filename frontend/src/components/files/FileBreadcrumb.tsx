import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFilesStore } from '@/stores/files-store';

export default function FileBreadcrumb() {
  const { currentPath } = useFilesStore();

  const pathParts = currentPath
    .split('/')
    .filter(Boolean);

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    ...pathParts.map((part, index) => ({
      name: part,
      path: '/' + pathParts.slice(0, index + 1).join('/'),
    })),
  ];

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          
          <Link
            to={`/files${breadcrumb.path}`}
            className="flex items-center hover:text-foreground transition-colors"
          >
            {index === 0 && <Home className="h-4 w-4 mr-1" />}
            {breadcrumb.name}
          </Link>
        </div>
      ))}
    </nav>
  );
}