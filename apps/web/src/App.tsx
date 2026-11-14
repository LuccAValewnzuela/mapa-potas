import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/query-client";
import { AppLayout } from "./components/layout/app-layout";
import { MapPage } from "./pages/map-page";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<MapPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
    </QueryClientProvider>
  );
}
