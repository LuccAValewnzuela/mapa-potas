import { DivIcon, Icon, Marker, type LatLngExpression } from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png?url";
import markerIcon from "leaflet/dist/images/marker-icon.png?url";
import markerShadow from "leaflet/dist/images/marker-shadow.png?url";

export type MapPoint = {
    lat: number;
    lng: number;
};

export const DEFAULT_MAP_CENTER: LatLngExpression = [49.194944, 16.607556];
export const DEFAULT_MAP_ZOOM = 12;

export const OSM_TITLE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const DRAFT_MARKER_ICON = new DivIcon({
    className: "",
    html: '<span style="display:block;width:16px;height:16px;border-radius:9999px;border:3px solid #fff;background:var(--primary);box-shadow:0 0 0 4px color-mix(in oklch, var(--primary) 30%, transparent)"></span>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

export function setupLeafletIcons() {
    const defaultIcon = new Icon({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
    });
    Marker.prototype.options.icon = defaultIcon;
}