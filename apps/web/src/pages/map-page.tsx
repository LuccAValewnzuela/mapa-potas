import { EventsMap } from "@/components/map/event-map";
import { EventPanel } from "@/components/map/event-panel";
import { groupEventsByPlace, type PlaceGroup } from "@/components/map/group-events";
import { PlacePanel } from "@/components/map/place-panel";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/use-events";
import { isApiError, type Event } from "@/lib/api";
import { Loader2Icon, MapPinIcon, RotateCcwIcon } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react"

type MapNoticeProps = {
    children: ReactNode;
    icon: ReactNode;
    role: "status" | "alert";
    action?: ReactNode;
};

export type PanelSelection =
    | { kind: "place"; group: PlaceGroup }
    | { kind: "event"; event: Event };


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
    const events = useMemo(() => eventsQuery.data ?? [], [eventsQuery.data]);

    const errorMessage = isApiError(eventsQuery.error) ? eventsQuery.error.message : "Could not load events";

    const { groups, orphans } = useMemo(() => groupEventsByPlace(events), [events]);
    const [selection, setSelection] = useState<PanelSelection | null>(null);

    function handleBackToPlace(event: Event) {
        const placeId = event.place?.id;
        if (!placeId) return;

        const group = groups.find((item) => item.place.id === placeId);
        setSelection(group ? { kind: "place", group: group } : null);
    }

    return (
        <div className="relative h-full min-h-0 w-full">
            <EventsMap
                groups={groups}
                orphans={orphans}
                onSelectPlace={(group) => setSelection({ kind: "place", group: group })}
                onSelectEvent={(event) => setSelection({ kind: "event", event: event })}
                />
            
            {selection?.kind === "event" ? (
                <EventPanel
                    event={selection.event}
                    onClose={() => setSelection(null)}
                    onBack={selection.event.place ? () => handleBackToPlace(selection.event) : undefined}
                />
             ) : selection?.kind === "place" ? (
                <PlacePanel group={selection.group} onClose={() => setSelection(null)} onSelectEvent={(event: Event) => setSelection({ kind: "event", event: event})} />
             ) : null
             }

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