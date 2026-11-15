import type { MapPoint } from "@/lib/map-config";
import { useMapEvents } from "react-leaflet";

export function MapClickHandler({ onClick }: { onClick: (point: MapPoint) => void }) {
    useMapEvents({
        click(event) {
            onClick({ lat: event.latlng.lat, lng: event.latlng.lng });
        },
    });

    return null;
}
