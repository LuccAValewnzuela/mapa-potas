import { Hono } from "hono";
import { type AuthEnv, requireActiveUser } from "../../middleware/auth";
import { PlacesController } from "./controller";

export const placesRoutes = new Hono<AuthEnv>();

placesRoutes.get("/nearby", PlacesController.getNearbyPlaces);
placesRoutes.post("/", requireActiveUser, PlacesController.createPlace);
