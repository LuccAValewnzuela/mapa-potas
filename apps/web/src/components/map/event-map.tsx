import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, OSM_ATTRIBUTION, OSM_TITLE_URL, setupLeafletIcons } from "@/lib/map-config";
import { latLngBounds } from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import type { Event } from "@/lib/api";
import type { PlaceGroup } from "./group-events";

type EventsMapProps = {
    groups: PlaceGroup[];
    orphans: Event[];
    onSelectPlace: (group: PlaceGroup) => void;
    onSelectEvent: (event: Event) => void;
};

setupLeafletIcons();

function FitToEvents({ groups, orphans }: { groups: PlaceGroup[]; orphans: Event[] }) {
    const map = useMap();
    useEffect(() => {
        const points: [number, number][] = [
            ...groups.map((group) => [group.place.latitude, group.place.longitude] as [number, number]),
            ...orphans.map((event) => [event.latitude, event.longitude] as [number, number]),
        ];

        if(points.length === 0) return;
        map.fitBounds(latLngBounds(points), { padding: [48, 48], maxZoom: 14 });
    }, [groups, orphans, map]);

    return null;
}

export function EventsMap({ groups, orphans, onSelectPlace, onSelectEvent }: EventsMapProps) {
    return (
        <MapContainer
            center={DEFAULT_MAP_CENTER}
            zoom={DEFAULT_MAP_ZOOM}
            scrollWheelZoom
            className="h-full w-full"
        >
            <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_TITLE_URL} />
            <FitToEvents groups={groups} orphans={orphans} />

            {groups.map(group => (
                <Marker
                    key={group.place.id}
                    position={[group.place.latitude, group.place.longitude]}
                    eventHandlers={{ click: () => onSelectPlace(group)}} />
            ))}
            {orphans.map(event => (
                <Marker
                    key={event.id}
                    position={[event.latitude, event.longitude]}
                    eventHandlers={{ click: () => onSelectEvent(event)}} />
            ))}
            
        </MapContainer>
    );
}