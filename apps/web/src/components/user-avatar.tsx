import { cn } from "@/lib/utils";

type UserAvatarProps = {
    displayName: string;
    className?: string;
};

function initials(displayName: string) {
    return displayName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

export function UserAvatar({ displayName, className }: UserAvatarProps) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                "flex size-8 shrink-0 select-none items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground",
                className,
            )}
        >
            {initials(displayName)}
        </span>
    );
}
