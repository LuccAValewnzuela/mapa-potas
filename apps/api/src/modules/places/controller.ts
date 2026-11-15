import type { Context } from "hono";
import type { AuthEnv } from "../../middleware/auth";
import { createPlaceSchema } from "./dto/create-place.dto";
import { nearbyPlacesQuerySchema } from "./dto/nearby-places-query.dto";
import type { NearbyPlace, Place } from "./models/place";
import { PlacesService } from "./service";

export class PlacesController {
  static async getNearbyPlaces(c: Context<AuthEnv>) {
    const query = nearbyPlacesQuerySchema.parse(c.req.query());
    const places = await PlacesService.getNearbyPlaces(query.lat, query.lng, query.radius);
    return c.json(places.map(PlacesController.toNearbyPlaceDto));
  }

  static async createPlace(c: Context<AuthEnv>) {
    const dto = createPlaceSchema.parse(await c.req.json());
    const place = await PlacesService.createPlace({
      name: dto.name,
      latitude: dto.latitude,
      longitude: dto.longitude,
      createdBy: c.get("user").id,
    });

    return c.json(PlacesController.toPlaceDto(place), 201);
  }

  private static toPlaceDto(place: Place) {
    return {
      id: place.id,
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      createdBy: place.createdBy,
      createdAt: place.createdAt,
    };
  }

  private static toNearbyPlaceDto(place: NearbyPlace) {
    return {
      ...PlacesController.toPlaceDto(place),
      distanceMeters: place.distanceMeters,
    };
  }
}
