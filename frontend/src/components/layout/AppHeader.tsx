import { Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth-store';
import { useToast } from '@/components/ui/use-toast';

export default function AppHeader() {
  const { user, logout } = useAuthStore();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: '로그아웃',
        description: '성공적으로 로그아웃되었습니다.',
      });
    } catch (error) {
      toast({
        title: '오류',
        description: '로그아웃 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="h-16 border-b bg-white dark:bg-gray-900 flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-primary">NAS Explorer</h1>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="파일 또는 폴더 검색..."
            className="pl-10 pr-4"
          />
        </div>
      </div>

      {/* User Menu */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {user?.username || 'Unknown'}
          </span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogout}
          className="flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>로그아웃</span>
        </Button>
      </div>
    </header>
  );
}