export type Place = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  createdBy: string | null;
  createdAt: Date;
};

export type NearbyPlace = Place & {
  distanceMeters: number;
};
