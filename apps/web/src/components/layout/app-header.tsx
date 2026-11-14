import { UserRound } from "lucide-react";
import { Button } from "../ui/button";


const APP_TITLE = "Mapa potas - Komarov";

export function AppHeader() {
    return (
        <header className="relative z-50 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
            <div className="min-w-0">
                <p className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                    {APP_TITLE}
                </p>
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Log in"
            >
                <UserRound />
                <span className="hidden sm:inline">Log in</span>
            </Button>
        </header>
    );
}