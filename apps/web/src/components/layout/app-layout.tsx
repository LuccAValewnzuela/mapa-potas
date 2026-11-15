import { Outlet } from "react-router-dom";
import { LoginDialogProvider } from "../auth/login-dialog-provider";
import { AppHeader } from "./app-header";



export function AppLayout() {
    return (
        <LoginDialogProvider>
            <div className="flex h-svh flex-col overflow-hidden bg-background">
                <AppHeader />
                <main className="min-h-0 flex-1">
                    <Outlet />
                </main>
            </div>
        </LoginDialogProvider>
    );
}
