import { mkdir, readFile as readFileFromDisk, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const defaultUploadRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../uploads");

export function getUploadRoot() {
  const configured = process.env.UPLOAD_DIR?.trim();
  return configured ? resolve(configured) : defaultUploadRoot;
}

function resolveStoragePath(key: string) {
  if (!key) throw new Error("Storage key is required");

  const root = getUploadRoot();
  const absolutePath = resolve(root, key);
  if (absolutePath === root || !absolutePath.startsWith(`${root}${sep}`)) {
    throw new Error("Invalid storage key");
  }

  return absolutePath;
}

export async function saveFile(key: string, data: Uint8Array) {
  const absolutePath = resolveStoragePath(key);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, data, { flag: "wx" });
}

export function readFile(key: string) {
  return readFileFromDisk(resolveStoragePath(key));
}

export async function deleteFile(key: string) {
  try {
    await unlink(resolveStoragePath(key));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
