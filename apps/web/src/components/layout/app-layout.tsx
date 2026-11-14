import { Outlet } from "react-router-dom";
import { AppHeader } from "./app-header";



export function AppLayout() {
    return (
        <div className="flex h-svh flex-col overflow-hidden bg-background">
            <AppHeader />
            <main className="min-h-0 flex-1">
                <Outlet />
            </main>
        </div>
    );
}