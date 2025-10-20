import React from 'react'
import { SidebarTrigger } from '../../components/ui/sidebar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../../components/ui/dropdown-menu'
import { User, Sun, Moon, LogOut } from 'lucide-react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../../components/LanguageSwitcher'

const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Dark mode state and effect
  const [dark, setDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || (localStorage.getItem('theme') === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  const handleLogout = () => {
    // Clear tokens
    Cookies.remove('token');
    // Also remove from localStorage if present
    localStorage.removeItem('token');
    toast.success(t('auth.logoutSuccess'));
    // Redirect to login after a delay
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between bg-background">
      {/* Left: Sidebar trigger button */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>
      {/* Center: Title or logo */}
      <div className="flex-1 flex justify-center">
        <span className="text-sm sm:text-lg font-semibold tracking-tight select-none">HotelShop Admin Panel</span>
      </div>
      {/* Right: Dark mode toggle, language switcher and user menu */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Language switcher */}
        <LanguageSwitcher />
        {/* Dark mode toggle */}
        <button
          aria-label="Toggle dark mode"
          onClick={() => setDark(d => !d)}
          className="rounded-full p-2 hover:bg-accent transition-colors focus:outline-none"
        >
          {dark ? <Sun className="size-5 text-yellow-400" /> : <Moon className="size-5 text-gray-700 dark:text-gray-200" />}
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full p-2 hover:bg-accent transition-colors">
              <User className="size-5" />
              <span className="hidden md:inline font-medium">{t('common.user')}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/profile')}>{t('common.profile')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings/profile')}>{t('common.settings')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 focus:bg-red-100 dark:hover:bg-red-900 dark:hover:text-red-200"
            >
              <LogOut className="w-4 h-4 mr-2 text-red-600" />
              {t('common.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Header