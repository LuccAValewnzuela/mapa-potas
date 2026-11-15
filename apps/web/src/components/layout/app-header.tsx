import { useMe, useLogout } from "@/hooks/use-auth";
import { UserRound } from "lucide-react";
import { useLoginDialog } from "../auth/login-dialog-context";
import { UserAvatar } from "../user-avatar";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";


const APP_TITLE = "Mapa potas - Komarov";

export function AppHeader() {
    const me = useMe();
    const logout = useLogout();
    const { openLoginDialog } = useLoginDialog();
    const user = me.data ?? null;

    return (
        <header className="relative z-50 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
            <div className="min-w-0">
                <p className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                    {APP_TITLE}
                </p>
            </div>

            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <UserAvatar
                                displayName={user.displayName}
                                className="size-6 text-[0.6rem]"
                            />
                            <span className="hidden max-w-32 truncate sm:inline">
                                {user.displayName}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            <span className="block">{user.displayName}</span>
                            <span className="block text-xs font-normal text-muted-foreground">
                                @{user.username}
                            </span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            disabled={logout.isPending}
                            onSelect={() => logout.mutate()}
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label="Log in"
                    onClick={openLoginDialog}
                >
                    <UserRound />
                    <span className="hidden sm:inline">Log in</span>
                </Button>
            )}
        </header>
    );
}
