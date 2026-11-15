import { useMemo, useState, type ReactNode } from "react";
import { LoginDialog } from "./login-dialog";
import { LoginDialogContext } from "./login-dialog-context";

export function LoginDialogProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const value = useMemo(() => ({ openLoginDialog: () => setOpen(true) }), []);

    return (
        <LoginDialogContext.Provider value={value}>
            {children}
            <LoginDialog open={open} onOpenChange={setOpen} />
        </LoginDialogContext.Provider>
    );
}
