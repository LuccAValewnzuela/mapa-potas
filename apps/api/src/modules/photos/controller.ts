import type { Context } from "hono";
import { AppError } from "../../lib/errors";
import type { AuthEnv } from "../../middleware/auth";
import { eventIdSchema } from "../events/dto/event-id.dto";
import { photoIdSchema } from "./dto/photo-id.dto";
import type { Photo } from "./models/photo";
import { PhotosService } from "./service";

export class PhotosController {
  static async upload(c: Context<AuthEnv>) {
    const eventId = eventIdSchema.parse(c.req.param("id"));
    const body = await c.req.parseBody();
    const file = body.photo;
    if (!(file instanceof File)) {
      throw new AppError(400, "invalid_photo", "Multipart field 'photo' is required");
    }

    const photo = await PhotosService.upload(eventId, c.get("user"), file);
    return c.json(PhotosController.toDto(photo), 201);
  }

  static async getBytes(c: Context<AuthEnv>) {
    const id = photoIdSchema.parse(c.req.param("id"));
    const { photo, bytes } = await PhotosService.getBytes(id);

    return c.body(bytes, 200, {
      "Content-Type": photo.mimeType,
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    });
  }

  static async delete(c: Context<AuthEnv>) {
    const id = photoIdSchema.parse(c.req.param("id"));
    await PhotosService.delete(id, c.get("user"));

    return c.body(null, 204);
  }

  private static toDto(photo: Photo) {
    return {
      id: photo.id,
      eventId: photo.eventId,
      uploadedBy: photo.uploadedBy,
      mimeType: photo.mimeType,
      createdAt: photo.createdAt,
      url: `/photos/${photo.id}`,
    };
  }
}
