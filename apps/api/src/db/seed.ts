import { eq } from "drizzle-orm";
import "../lib/env";
import { hashPassword } from "../lib/password";
import { registerSchema } from "../modules/auth/dto/register.dto";
import { db } from "./index";
import { users } from "./schema";

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

async function main() {
  const input = registerSchema.parse({
    username: requireEnv("ADMIN_USERNAME"),
    password: requireEnv("ADMIN_PASSWORD"),
    displayName: process.env.ADMIN_DISPLAY_NAME?.trim() || "Admin",
  });

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, input.username))
    .limit(1);

  if (existing) {
    const [user] = await db
      .update(users)
      .set({ status: "active", role: "admin" })
      .where(eq(users.id, existing.id))
      .returning({ username: users.username });

    console.log(`Admin "${user.username}" already existed; ensured active/admin.`);
    return;
  }

  const passwordHash = await hashPassword(input.password);
  const [user] = await db
    .insert(users)
    .values({
      username: input.username,
      displayName: input.displayName,
      passwordHash,
      status: "active",
      role: "admin",
    })
    .returning({ username: users.username });

  console.log(`Created admin "${user.username}".`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
