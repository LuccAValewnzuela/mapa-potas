import { ImageIcon, MapPinIcon } from "lucide-react";
import type { Event } from "@/lib/api";
import { formatEventDate } from "@/lib/utils";
import { UserAvatar } from "../user-avatar";
import { PanelShell } from "./panel-shell";

type EventPanelProps = {
    event: Event;
    onClose: () => void;
    onBack?: () => void;
};

export function EventPanel({ event, onClose, onBack }: EventPanelProps) {
    return (
        <PanelShell
            title={event.displayName}
            subtitle={
                <span className="flex flex-col gap-1">
                    <span>{formatEventDate(event.occurredAt)}</span>
                    {event.place ? (
                        <span className="flex items-center gap-1">
                            <MapPinIcon className="size-3.5" />
                            {event.place.name}
                        </span>
                    ) : null}
                </span>
            }
            onClose={onClose}
            onBack={onBack}
        >
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <UserAvatar displayName={event.displayName} />
                    <p className="text-sm text-muted-foreground">@{event.username}</p>
                </div>

                <section>
                    <h3 className="text-sm font-semibold">Note</h3>
                    {event.note ? (
                        <p className="mt-1 whitespace-pre-wrap text-sm">{event.note}</p>
                    ) : (
                        <p className="mt-1 text-sm text-muted-foreground">No note</p>
                    )}
                </section>

                <section>
                    <h3 className="text-sm font-semibold">Photos</h3>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {[0, 1, 2].map((index) => (
                            <div
                                key={index}
                                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border bg-muted text-muted-foreground"
                            >
                                <ImageIcon className="size-5" />
                                <span className="text-[0.65rem]">Coming soon</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-sm font-semibold">Comments</h3>
                    <div className="mt-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                        Comments coming soon
                    </div>
                </section>
            </div>
        </PanelShell>
    );
}
