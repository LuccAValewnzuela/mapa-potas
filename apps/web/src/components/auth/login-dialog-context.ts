import { createContext, useContext } from "react";

type LoginDialogContextValue = {
    openLoginDialog: () => void;
};

export const LoginDialogContext = createContext<LoginDialogContextValue | null>(null);

export function useLoginDialog() {
    const context = useContext(LoginDialogContext);
    if (!context) {
        throw new Error("useLoginDialog must be used within LoginDialogProvider");
    }
    return context;
}
