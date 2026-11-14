import { randomUUID } from "node:crypto";
import { AppError } from "../../lib/errors";
import { deleteFile, readFile, saveFile } from "../../lib/storage";
import type { SessionUser } from "../auth/models/session-user";
import { EventsService } from "../events/service";
import { PhotosRepository } from "./repository";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export class PhotosService {
  static async upload(eventId: string, actor: SessionUser, file: File) {
    await EventsService.getEventById(eventId);

    const extension = EXTENSIONS[file.type];
    if (!extension) {
      throw new AppError(415, "unsupported_media_type", "Unsupported image type");
    }
    if (file.size === 0) {
      throw new AppError(400, "invalid_photo", "Photo is empty");
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new AppError(413, "payload_too_large", "Photo must be 10 MB or smaller");
    }

    const storageKey = `photos/${randomUUID()}${extension}`;
    await saveFile(storageKey, new Uint8Array(await file.arrayBuffer()));

    try {
      const photo = await PhotosRepository.createPhoto({
        eventId,
        uploadedBy: actor.id,
        storageKey,
        mimeType: file.type,
      });
      if (!photo) throw new Error("Photo insert failed");

      return photo;
    } catch (error) {
      await deleteFile(storageKey).catch((cleanupError) => {
        console.error("Failed to clean up uploaded photo file", cleanupError);
      });
      throw error;
    }
  }

  static async getBytes(id: string) {
    const photo = await PhotosRepository.getPhotoById(id);
    if (!photo) throw new AppError(404, "photo_not_found", "Photo not found");

    try {
      const bytes = await readFile(photo.storageKey);
      return { photo, bytes };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        throw new AppError(404, "photo_not_found", "Photo not found");
      }
      throw error;
    }
  }

  static async delete(id: string, actor: SessionUser) {
    const photo = await PhotosRepository.getPhotoById(id);
    if (!photo) throw new AppError(404, "photo_not_found", "Photo not found");
    if (photo.uploadedBy !== actor.id) {
      throw new AppError(403, "forbidden", "You can only delete your own photos");
    }

    const deleted = await PhotosRepository.deletePhoto(id);
    if (!deleted) throw new AppError(404, "photo_not_found", "Photo not found");

    await deleteFile(deleted.storageKey).catch((error) => {
      console.error("Failed to delete photo file", error);
    });
  }
}
