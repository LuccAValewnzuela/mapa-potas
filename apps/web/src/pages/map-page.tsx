import { EventsMap } from "@/components/map/event-map";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/use-events";
import { isApiError } from "@/lib/api";
import { Loader2Icon, MapPinIcon, RotateCcwIcon } from "lucide-react";
import type { ReactNode } from "react"


type MapNoticeProps = {
    children: ReactNode;
    icon: ReactNode;
    role: "status" | "alert";
    action?: ReactNode;
};

function MapNotice({ children, icon, role, action} : MapNoticeProps) {
    return (
        <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center p-4">
            <div
                role={role}
                className="pointer-events-auto flex items-center gap-3 rounded-lg border bg-background/95 px-4 py-3 text-sm shadow-lg backdrop-blur">
                    {icon}
                    <span>{children}</span>
                    {action}
            </div>
        </div>
    );
}


export function MapPage() {
    const eventsQuery = useEvents();
    const events = eventsQuery.data ?? [];

    const errorMessage = isApiError(eventsQuery.error) ? eventsQuery.error.message : "Could not load events";

    return (
        <div className="relative h-full min-h-0 w-full">
            <EventsMap events={events} />

            {eventsQuery.isPending ? (
                <MapNotice
                    role="status"
                    icon={<Loader2Icon className="size-4 animate-spin" />}>
                        Loading events...
                </MapNotice>
            ) : null}

            {eventsQuery.isError ? (
                <MapNotice
                    role="alert"
                    icon={<MapPinIcon className="size-4 text-destructive" />}
                    action={
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => void eventsQuery.refetch()}
                        >
                            <RotateCcwIcon />
                            Retry
                        </Button>
                    }
                >
                    {errorMessage}
                </MapNotice>
            ) : null}

            {eventsQuery.isSuccess && events.length === 0 ? (
                <MapNotice role="status" icon={<MapPinIcon className="size-4" />}>
                    No events to show yet.
                </MapNotice>
            ) : null}
        </div>
    );
}