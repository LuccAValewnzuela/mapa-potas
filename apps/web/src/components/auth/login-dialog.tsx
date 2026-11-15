import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/use-auth";
import { isApiError } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
    username: z.string().trim().min(1, "Enter your username"),
    password: z.string().min(1, "Enter your password"),
});

type LoginValues = z.infer<typeof loginSchema>;

type LoginDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
    const login = useLogin();
    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "", password: "" },
    });

    function close() {
        form.reset();
        login.reset();
        onOpenChange(false);
    }

    function handleOpenChange(next: boolean) {
        if (!next) close();
        else onOpenChange(true);
    }

    function onSubmit(values: LoginValues) {
        login.mutate(values, {
            onSuccess: () => close(),
        });
    }

    const errorMessage = login.error
        ? isApiError(login.error)
            ? login.error.message
            : "Could not log in"
        : null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Log in</DialogTitle>
                    <DialogDescription>
                        Log in to create potas and interact with other people.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="login-username">Username</Label>
                        <Input
                            id="login-username"
                            autoComplete="username"
                            autoFocus
                            {...form.register("username")}
                        />
                        {form.formState.errors.username ? (
                            <p className="text-xs text-destructive">
                                {form.formState.errors.username.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                            id="login-password"
                            type="password"
                            autoComplete="current-password"
                            {...form.register("password")}
                        />
                        {form.formState.errors.password ? (
                            <p className="text-xs text-destructive">
                                {form.formState.errors.password.message}
                            </p>
                        ) : null}
                    </div>
                    {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={close}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={login.isPending}>
                            {login.isPending ? "Logging in..." : "Log in"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
