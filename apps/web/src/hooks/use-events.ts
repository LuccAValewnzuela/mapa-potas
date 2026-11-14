import { eventsApi, queryKeys, type EventQuery } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";


export function useEvents(query: EventQuery = {}) {
    return useQuery({
        queryKey: queryKeys.events.list(query),
        queryFn: () => eventsApi.list(query),
    });
}