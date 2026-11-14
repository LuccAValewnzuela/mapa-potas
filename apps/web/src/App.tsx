import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/query-client";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <main className="grid min-h-svh place-items-center bg-muted/30 p-6">
          <div className="max-w-md space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Mapa Potas</h1>
            <p className="text-muted-foreground">
              Frontend scaffold is ready. Auth and map screens come next.
            </p>
          </div>
        </main>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}
