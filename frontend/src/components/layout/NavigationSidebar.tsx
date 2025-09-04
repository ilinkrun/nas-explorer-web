import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Folder,
  FileText,
  Star,
  Clock,
  Trash2,
  Settings,
} from 'lucide-react';

const navigationItems = [
  {
    title: '파일',
    href: '/files',
    icon: Folder,
  },
  {
    title: '문서 변환',
    href: '/convert',
    icon: FileText,
  },
  {
    title: '즐겨찾기',
    href: '/favorites',
    icon: Star,
  },
  {
    title: '최근 파일',
    href: '/recent',
    icon: Clock,
  },
  {
    title: '휴지통',
    href: '/trash',
    icon: Trash2,
  },
  {
    title: '설정',
    href: '/settings',
    icon: Settings,
  },
];

export default function NavigationSidebar() {
  const location = useLocation();

  return (
    <nav className="w-64 bg-muted/30 border-r h-full">
      <div className="p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}