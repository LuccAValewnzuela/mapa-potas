import { useLoginDialog } from "@/components/auth/login-dialog-context";
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
import { Textarea } from "@/components/ui/textarea";
import { useMe } from "@/hooks/use-auth";
import { useCreateEvent } from "@/hooks/use-create-event";
import { isApiError, placesApi, type Place } from "@/lib/api";
import type { MapPoint } from "@/lib/map-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type CreatePotaDialogProps = {
    onClose: () => void;
    onCreated: () => void;
} & (
    | { kind: "place"; place: Place }
    | { kind: "point"; point: MapPoint }
);

type CreatePotaValues = {
    occurredAt: string;
    note: string;
    placeName: string;
};

function toDateTimeLocal(date: Date) {
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function defaultValues(): CreatePotaValues {
    return {
        occurredAt: toDateTimeLocal(new Date()),
        note: "",
        placeName: "",
    };
}

export function CreatePotaDialog(props: CreatePotaDialogProps) {
    const { onClose, onCreated } = props;
    const coords =
        props.kind === "place"
            ? { lat: props.place.latitude, lng: props.place.longitude }
            : props.point;

    const me = useMe();
    const user = me.data ?? null;
    const createEvent = useCreateEvent();
    const { openLoginDialog } = useLoginDialog();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const form = useForm<CreatePotaValues>({
        resolver: zodResolver(
            z.object({
                occurredAt: z.string().min(1, "Pick a date and time"),
                note: z.string().trim().max(500, "Note must be 500 characters or less"),
                placeName:
                    props.kind === "point"
                        ? z
                              .string()
                              .trim()
                              .min(1, "Enter a place name")
                              .max(100, "Place name must be 100 characters or less")
                        : z.string(),
            }),
        ),
        defaultValues: defaultValues(),
    });
    const errors = form.formState.errors;

    function close() {
        form.reset(defaultValues());
        setSubmitError(null);
        createEvent.reset();
        onClose();
    }

    async function onSubmit(values: CreatePotaValues) {
        if (!user) return;
        setSubmitError(null);

        try {
            let placeId = props.kind === "place" ? props.place.id : null;

            if (props.kind === "point") {
                const place = await placesApi.create({
                    name: values.placeName.trim(),
                    latitude: coords.lat,
                    longitude: coords.lng,
                });
                placeId = place.id;
            }

            await createEvent.mutateAsync({
                userId: user.id,
                placeId,
                latitude: coords.lat,
                longitude: coords.lng,
                occurredAt: new Date(values.occurredAt).toISOString(),
                note: values.note.trim() || null,
            });

            toast.success("Pota created");
            form.reset(defaultValues());
            onCreated();
        } catch (error) {
            setSubmitError(isApiError(error) ? error.message : "Could not create the pota");
        }
    }

    const isSubmitting = createEvent.isPending;

    return (
        <Dialog
            open
            onOpenChange={(next) => {
                if (!next) close();
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New pota</DialogTitle>
                    <DialogDescription>
                        {props.kind === "place"
                            ? `At ${props.place.name}`
                            : `Creates a new place at ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`}
                    </DialogDescription>
                </DialogHeader>

                {me.isPending ? (
                    <p className="text-sm text-muted-foreground">Checking your session...</p>
                ) : !user ? (
                    <div className="flex flex-col gap-3">
                        <p className="text-sm text-muted-foreground">
                            You need to be logged in to create a pota.
                        </p>
                        <Button type="button" onClick={openLoginDialog}>
                            Log in
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        {props.kind === "point" ? (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="pota-place-name">Place name</Label>
                                <Input
                                    id="pota-place-name"
                                    placeholder="Where is this?"
                                    maxLength={100}
                                    {...form.register("placeName")}
                                />
                                {errors.placeName ? (
                                    <p className="text-xs text-destructive">
                                        {errors.placeName.message}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="pota-occurred-at">When</Label>
                            <Input
                                id="pota-occurred-at"
                                type="datetime-local"
                                {...form.register("occurredAt")}
                            />
                            {errors.occurredAt ? (
                                <p className="text-xs text-destructive">{errors.occurredAt.message}</p>
                            ) : null}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="pota-note">Note</Label>
                            <Textarea
                                id="pota-note"
                                rows={3}
                                maxLength={500}
                                placeholder="What happened?"
                                {...form.register("note")}
                            />
                            {errors.note ? (
                                <p className="text-xs text-destructive">{errors.note.message}</p>
                            ) : null}
                        </div>

                        {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={close}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create pota"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
