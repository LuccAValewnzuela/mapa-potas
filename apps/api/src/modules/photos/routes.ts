import { Hono } from "hono";
import { type AuthEnv, requireActiveUser } from "../../middleware/auth";
import { PhotosController } from "./controller";

export const photoRoutes = new Hono<AuthEnv>();

photoRoutes.get("/:id", PhotosController.getBytes);
photoRoutes.delete("/:id", requireActiveUser, PhotosController.delete);

export const eventPhotoRoutes = new Hono<AuthEnv>();

eventPhotoRoutes.post("/:id/photos", requireActiveUser, PhotosController.upload);
