import { ArrowLeftIcon, XIcon } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Button } from "../ui/button";

type PanelShellProps = {
    title: ReactNode;
    subtitle?: ReactNode;
    onClose: () => void;
    onBack?: () => void;
    children: ReactNode;
};

export function PanelShell({ title, subtitle, onClose, onBack, children }: PanelShellProps) {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") onClose();
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <aside className="absolute inset-y-0 right-0 z-[1000] flex h-full w-full animate-in flex-col border-l bg-background shadow-xl slide-in-from-right-4 duration-200 sm:max-w-sm">
            <header className="flex shrink-0 items-start gap-2 border-b p-4">
                {onBack ? (
                    <Button type="button" variant="ghost" size="icon" onClick={onBack} aria-label="Back">
                        <ArrowLeftIcon />
                    </Button>
                ) : null}
                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-xl font-semibold">{title}</h2>
                    {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
                    <XIcon />
                </Button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">{children}</div>
        </aside>
    );
}
