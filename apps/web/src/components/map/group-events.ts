import type { Place, Event } from "@/lib/api";

export type PlaceGroup = {
    place: Place;
    events: Event[];
};

export function groupEventsByPlace(events: Event[]): { groups: PlaceGroup[]; orphans: Event[] } {
    const byPlace = new Map<string, PlaceGroup>();
    const orphans: Event[] = [];

    for (const event of events) {
        if(!event.place) {
            orphans.push(event);
            continue;
        }
        const group = byPlace.get(event.place.id);
        if(group) group.events.push(event);
        else byPlace.set(event.place.id, { place: event.place, events: [event] });
    }

    return { groups: [ ...byPlace.values()], orphans};
}