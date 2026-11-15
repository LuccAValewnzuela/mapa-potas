import { EventsMap } from "@/components/map/event-map";
import { EventPanel } from "@/components/map/event-panel";
import { CreatePotaDialog } from "@/components/map/create-pota-dialog";
import { groupEventsByPlace, type PlaceGroup } from "@/components/map/group-events";
import { PlacePanel } from "@/components/map/place-panel";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/use-events";
import { isApiError, type Event, type Place } from "@/lib/api";
import type { MapPoint } from "@/lib/map-config";
import { Loader2Icon, MapPinIcon, PlusIcon, RotateCcwIcon, XIcon } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react"

type MapNoticeProps = {
    children: ReactNode;
    icon: ReactNode;
    role: "status" | "alert";
    action?: ReactNode;
};

export type PanelSelection =
    | { kind: "place"; placeId: string }
    | { kind: "event"; eventId: string };


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
    const [draftPoint, setDraftPoint] = useState<MapPoint | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newPotaPlace, setNewPotaPlace] = useState<Place | null>(null);

    const selectedGroup =
        selection?.kind === "place"
            ? (groups.find((group) => group.place.id === selection.placeId) ?? null)
            : null;
    const selectedEvent =
        selection?.kind === "event"
            ? (events.find((event) => event.id === selection.eventId) ?? null)
            : null;

    function clearDraft() {
        setIsCreateOpen(false);
        setDraftPoint(null);
    }

    function handleMapClick(point: MapPoint) {
        setSelection(null);
        setDraftPoint(point);
        setIsCreateOpen(false);
    }

    function handleSelectPlace(group: PlaceGroup) {
        setDraftPoint(null);
        setSelection({ kind: "place", placeId: group.place.id });
    }

    function handleSelectEvent(event: Event) {
        setDraftPoint(null);
        setSelection({ kind: "event", eventId: event.id });
    }

    function handleBackToPlace(event: Event) {
        const placeId = event.place?.id;
        if (!placeId) return;

        setSelection({ kind: "place", placeId: placeId });
    }

    return (
        <div className="relative h-full min-h-0 w-full">
            <EventsMap
                groups={groups}
                orphans={orphans}
                draftPoint={draftPoint}
                onMapClick={handleMapClick}
                onSelectPlace={handleSelectPlace}
                onSelectEvent={handleSelectEvent}
                />

            {draftPoint && !isCreateOpen && !selection ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[1000] flex justify-center px-4">
                    <div className="pointer-events-auto flex items-center gap-1 rounded-lg border bg-background/95 py-1.5 pr-1.5 pl-4 shadow-lg backdrop-blur">
                        <span className="mr-2 text-sm text-muted-foreground">
                            Create a pota here?
                        </span>
                        <Button type="button" size="sm" onClick={() => setIsCreateOpen(true)}>
                            <PlusIcon />
                            Create pota
                        </Button>
                        <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            aria-label="Cancel"
                            onClick={clearDraft}
                        >
                            <XIcon />
                        </Button>
                    </div>
                </div>
            ) : null}

            {draftPoint && isCreateOpen ? (
                <CreatePotaDialog
                    kind="point"
                    point={draftPoint}
                    onClose={clearDraft}
                    onCreated={clearDraft}
                />
            ) : null}

            {newPotaPlace ? (
                <CreatePotaDialog
                    kind="place"
                    place={newPotaPlace}
                    onClose={() => setNewPotaPlace(null)}
                    onCreated={() => setNewPotaPlace(null)}
                />
            ) : null}
            
            {selectedEvent ? (
                <EventPanel
                    event={selectedEvent}
                    onClose={() => setSelection(null)}
                    onBack={selectedEvent.place ? () => handleBackToPlace(selectedEvent) : undefined}
                />
             ) : selectedGroup ? (
                <PlacePanel
                    group={selectedGroup}
                    onClose={() => setSelection(null)}
                    onSelectEvent={handleSelectEvent}
                    onCreatePota={setNewPotaPlace}
                />
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