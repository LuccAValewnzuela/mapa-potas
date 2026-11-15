import { eventsApi, queryKeys, type CreateEventInput } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";

export function useCreateEvent() {
    return useMutation({
        mutationFn: (input: CreateEventInput) => eventsApi.create(input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
            void queryClient.invalidateQueries({ queryKey: queryKeys.places.all });
        },
    });
}
