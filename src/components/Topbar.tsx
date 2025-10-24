import { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-20 bg-card border-b border-border px-8 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar habitación o cliente"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background text-foreground border-border"
          />
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <Avatar>
              <AvatarImage src="https://c.animaapp.com/mh48aku2CGdPZo/img/ai_3.png" alt="Admin avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
            </Avatar>
            <span className="text-foreground font-medium">Admin</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-popover text-popover-foreground">
          <DropdownMenuLabel className="text-popover-foreground">Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-popover-foreground hover:bg-muted cursor-pointer">
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem className="text-popover-foreground hover:bg-muted cursor-pointer">
            Configuración
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-warning hover:bg-muted cursor-pointer">
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
