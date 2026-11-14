import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { events, photos, users } from "../../db/schema";
import type { CreatePhotoInput } from "./models/photo-input";

const photoColumns = {
  id: photos.id,
  eventId: photos.eventId,
  uploadedBy: photos.uploadedBy,
  storageKey: photos.storageKey,
  mimeType: photos.mimeType,
  createdAt: photos.createdAt,
};

export class PhotosRepository {
  static async createPhoto(input: CreatePhotoInput) {
    const [row] = await db.insert(photos).values(input).returning(photoColumns);
    return row;
  }

  static async getPhotoById(id: string) {
    const [row] = await db
      .select(photoColumns)
      .from(photos)
      .innerJoin(events, eq(events.id, photos.eventId))
      .innerJoin(users, eq(users.id, events.userId))
      .where(and(eq(photos.id, id), eq(users.status, "active")))
      .limit(1);

    return row;
  }

  static async deletePhoto(id: string) {
    const [row] = await db
      .delete(photos)
      .where(eq(photos.id, id))
      .returning({ id: photos.id, storageKey: photos.storageKey });

    return row;
  }
}
