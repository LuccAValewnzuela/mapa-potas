import { ChevronRightIcon, PlusIcon } from "lucide-react";
import type { Event, Place } from "@/lib/api";
import { formatEventDate } from "@/lib/utils";
import { Button } from "../ui/button";
import { UserAvatar } from "../user-avatar";
import type { PlaceGroup } from "./group-events";
import { PanelShell } from "./panel-shell";

type PlacePanelProps = {
    group: PlaceGroup;
    onClose: () => void;
    onSelectEvent: (event: Event) => void;
    onCreatePota: (place: Place) => void;
};

export function PlacePanel({ group, onClose, onSelectEvent, onCreatePota }: PlacePanelProps) {
    const people = new Set(group.events.map((event) => event.userId)).size;

    return (
        <PanelShell
            title={group.place.name}
            subtitle={`${group.events.length} ${group.events.length === 1 ? "pota" : "potas"} · ${people} ${people === 1 ? "person" : "people"}`}
            onClose={onClose}
        >
            <Button
                type="button"
                size="sm"
                className="mb-3 w-full"
                onClick={() => onCreatePota(group.place)}
            >
                <PlusIcon />
                New pota
            </Button>

            <ul className="flex flex-col gap-1">
                {group.events.map((event) => (
                    <li key={event.id}>
                        <button
                            type="button"
                            onClick={() => onSelectEvent(event)}
                            className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                            <UserAvatar displayName={event.displayName} />
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium">
                                    {event.displayName}
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                    {formatEventDate(event.occurredAt)}
                                </span>
                            </span>
                            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
                        </button>
                    </li>
                ))}
            </ul>
        </PanelShell>
    );
}
