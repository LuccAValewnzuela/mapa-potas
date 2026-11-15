import { authApi, isApiError, queryKeys, type AuthUser, type LoginInput } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useMe() {
    return useQuery({
        queryKey: queryKeys.auth.me,
        queryFn: async (): Promise<AuthUser | null> => {
            try {
                return await authApi.me();
            } catch (error) {
                if (isApiError(error) && error.status === 401) return null;
                throw error;
            }
        },
        retry: false,
    });
}

export function useLogin() {
    return useMutation({
        mutationFn: (input: LoginInput) => authApi.login(input),
        onSuccess: (user) => {
            queryClient.setQueryData(queryKeys.auth.me, user);
            toast.success(`Welcome, ${user.displayName}`);
        },
    });
}

export function useLogout() {
    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            queryClient.setQueryData(queryKeys.auth.me, null);
            toast.success("Logged out");
        },
    });
}
