import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "../../db";
import { places } from "../../db/schema";
import type { CreatePlaceInput } from "./models/place-input";

export type PlaceBounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

export class PlacesRepository {
  static async createPlace(placeData: CreatePlaceInput) {
    const [row] = await db
      .insert(places)
      .values(placeData)
      .returning({ id: places.id });

    return row;
  }

  static async getPlaceById(placeId: string) {
    const [row] = await db
      .select()
      .from(places)
      .where(eq(places.id, placeId))
      .limit(1);

    return row;
  }

  static async getPlacesInBounds(bounds: PlaceBounds) {
    return db
      .select()
      .from(places)
      .where(
        and(
          gte(places.latitude, bounds.minLat),
          lte(places.latitude, bounds.maxLat),
          gte(places.longitude, bounds.minLng),
          lte(places.longitude, bounds.maxLng),
        ),
      );
  }
}
