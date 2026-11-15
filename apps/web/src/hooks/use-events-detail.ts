import { eventsApi, queryKeys } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";



export function useEventsDetail(id: string | null) {
    return useQuery({
        queryKey: queryKeys.events.detail(id ?? ""),
        queryFn: () => eventsApi.get(id!),
        enabled: id !== null
    });
}