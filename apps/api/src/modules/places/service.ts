import { AppError } from "../../lib/errors";
import type { CreatePlaceInput } from "./models/place-input";
import type { NearbyPlace } from "./models/place";
import { PlacesRepository } from "./repository";

const METERS_PER_DEGREE_LAT = 111_320;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadiusMeters = 6_371_000;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusMeters * Math.asin(Math.sqrt(a));
}

export class PlacesService {
  static async createPlace(placeData: CreatePlaceInput) {
    const result = await PlacesRepository.createPlace(placeData);
    if (!result) throw new AppError(500, "internal_error", "Could not create place");
    return PlacesService.getPlaceById(result.id);
  }

  static async getPlaceById(id: string) {
    const place = await PlacesRepository.getPlaceById(id);
    if (!place) throw new AppError(404, "place_not_found", "Place not found");
    return place;
  }

  static async getNearbyPlaces(lat: number, lng: number, radius: number): Promise<NearbyPlace[]> {
    const latDelta = radius / METERS_PER_DEGREE_LAT;
    const lngDelta = radius / Math.max(METERS_PER_DEGREE_LAT * Math.cos(toRadians(lat)), 1);
    const candidates = await PlacesRepository.getPlacesInBounds({
      minLat: lat - latDelta,
      maxLat: lat + latDelta,
      minLng: lng - lngDelta,
      maxLng: lng + lngDelta,
    });

    return candidates
      .map((place) => ({
        ...place,
        distanceMeters: Math.round(distanceMeters(lat, lng, place.latitude, place.longitude)),
      }))
      .filter((place) => place.distanceMeters <= radius)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }
}
