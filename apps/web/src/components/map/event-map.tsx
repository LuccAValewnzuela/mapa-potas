import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, OSM_ATTRIBUTION, OSM_TITLE_URL, setupLeafletIcons } from "@/lib/map-config";
import { latLngBounds } from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Event } from "@/lib/api";

setupLeafletIcons();

function FitToEvents({ events }: { events: Event[] }) {
    const map = useMap();
    useEffect(() => {
        if (events.length === 0) return;
        const bounds = latLngBounds(
            events.map(
                (event) => [event.latitude, event.longitude] as [number, number],
            )
        );

        map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
    }, [events, map]);

    return null;
}

function formatEventDate(value: string) {
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export function EventsMap({ events }: { events: Event[] }) {
    return (
        <MapContainer
            center={DEFAULT_MAP_CENTER}
            zoom={DEFAULT_MAP_ZOOM}
            scrollWheelZoom
            className="h-full w-full"
        >
            <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_TITLE_URL} />
            <FitToEvents events={events} />

            {events.map((event) =>(
                <Marker
                    key={event.id}
                    position={[event.latitude, event.longitude]}
                >
                    <Popup>
                        <div className="space-y-1">
                            <p className="text-sm font-semibold">{event.displayName}</p>
                            <p className="text-xs text-muted-foreground">{formatEventDate(event.occurredAt)}</p>
                            {event.note ? (
                                <p className="max-w-64 text-sm">{event.note}</p>
                            ) : null}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}