import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UsersIcon, SettingsIcon, HistoryIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { path: '/clientes', icon: UsersIcon, label: 'Clientes' },
    { path: '/configuracion', icon: SettingsIcon, label: 'Configuración' },
    { path: '/historial', icon: HistoryIcon, label: 'Historial' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`bg-gradient-1 text-white transition-all duration-200 ease-in flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        {!collapsed && (
          <h1 className="text-xl font-headline font-semibold text-navbar-foreground">Hotel Grupo Ariel</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="bg-transparent text-navbar-foreground hover:bg-secondary hover:text-navbar-foreground"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRightIcon className="w-6 h-6" /> : <ChevronLeftIcon className="w-6 h-6" />}
        </Button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <TooltipProvider>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link to={item.path}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-4 bg-transparent text-navbar-foreground hover:bg-secondary hover:text-navbar-foreground ${
                        active ? 'bg-secondary text-navbar-foreground' : ''
                      } ${collapsed ? 'px-3' : 'px-4'}`}
                    >
                      <Icon className="w-6 h-6 flex-shrink-0" />
                      {!collapsed && <span className="text-navbar-foreground">{item.label}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    <p className="text-foreground">{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

    </aside>
  );
}
