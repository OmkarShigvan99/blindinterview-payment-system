'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { LogOut, User, Package, Coins } from 'lucide-react';
import { UserDTO } from '@shared/types/user';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { API_AUTH_ENDPOINTS } from '@/fetch/endpoints';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const buttonVariants = {
    hover: {
        scale: 1.02,
        transition: { duration: 0.2 },
    },
    tap: {
        scale: 0.98,
        transition: { duration: 0.1 },
    },
};

type Props = {
    user: UserDTO;
    children?: React.ReactNode;
};

export default function UserNav({ user }: Props) {
    const { resetAuthData } = useAuth();
    const router = useRouter();

    const onLogout = async () => {
        try {
            await API_AUTH_ENDPOINTS.logout();
            resetAuthData();
            toast.success('Logout successful');
            router.push('/login');
        } catch (err) {
            console.log(err);
            toast.error('Logout failed');
        } finally {
            resetAuthData();
        }
    };

    // Create initials from user name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                        variant="ghost"
                        className="relative h-9 w-9 rounded-full p-0 hover:bg-primary/10 transition-colors"
                    >
                        <Avatar className="h-9 w-9">
                            <AvatarImage
                                src={user.avatar || ''}
                                alt={user.name}
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>

                        {/* Online Status */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    </Button>
                </motion.div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-64 mt-2 p-2 bg-background/75 backdrop-blur border border-border/50 rounded-xl shadow-lg"
                align="end"
            >
                {/* User Header */}
                <div className="px-3 py-3 border-b border-border/20">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={user.avatar || ''}
                                alt={user.name}
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Coins className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs font-medium text-yellow-600">
                                    {user.credits || 0} credits
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                    <DropdownMenuItem
                        className="rounded-lg px-3 py-2 cursor-pointer hover:bg-accent/20 focus:bg-accent/20 hover:text-black dark:hover:text-white focus:text-black dark:focus:text-white"
                        onClick={() => router.push('/profile')}
                    >
                        <User className="w-4 h-4 mr-3 text-blue-600" />
                        <div>
                            <p className="font-medium text-sm">Profile</p>
                            <p className="text-xs text-muted-foreground">Manage account</p>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="rounded-lg px-3 py-2 cursor-pointer hover:bg-accent/20 focus:bg-accent/20 hover:text-black dark:hover:text-white focus:text-black dark:focus:text-white"
                        onClick={() => router.push('/orders')}
                    >
                        <Package className="w-4 h-4 mr-3 text-green-600" />
                        <div>
                            <p className="font-medium text-sm">Orders</p>
                            <p className="text-xs text-muted-foreground">View history</p>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="rounded-lg px-3 py-2 cursor-pointer hover:bg-accent/20 focus:bg-accent/20 hover:text-black dark:hover:text-white focus:text-black dark:focus:text-white"
                        onClick={() => router.push('/buy')}
                    >
                        <Coins className="w-4 h-4 mr-3 text-yellow-600" />
                        <div>
                            <p className="font-medium text-sm">Buy Credits</p>
                            <p className="text-xs text-muted-foreground">Purchase more</p>
                        </div>
                    </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="mx-2" />

                {/* Settings & Logout */}
                <div className="py-2">
                    <DropdownMenuItem
                        className="rounded-lg px-3 py-2 cursor-pointer text-red-600 hover:bg-red-600/20 focus:bg-red-600/20 hover:text-red-600 focus:text-red-600"
                        onClick={onLogout}
                    >
                        <LogOut className="w-4 h-4 mr-3 text-destructive" />
                        <div>
                            <p className="font-medium text-sm">Sign Out</p>
                            <p className="text-xs text-red-500/70">Logout account</p>
                        </div>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
