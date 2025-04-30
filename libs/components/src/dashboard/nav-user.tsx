'use client';

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
} from 'lucide-react';

import { useAuthContext } from '@/contexts/auth.context';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/ui/sidebar';
import { generateUserInitials } from '@/utils';
import { useRouter } from 'next/navigation';

const UserAvatar = () => {
  const { user } = useAuthContext();
  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
      <AvatarFallback className="rounded-lg">
        {generateUserInitials(user?.displayName)}
      </AvatarFallback>
    </Avatar>
  );
};

export function NavUser() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { user } = useAuthContext();

  const onClickLogout = () => {
    router.replace('/logout');
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.displayName}
                </span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar />

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.displayName || ''}
                  </span>
                  <span className="truncate text-xs">{user?.email || ''}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onClickLogout}>
              <LogOut className="text-red-500" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
