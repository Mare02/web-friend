/**
 * User Service
 * Handles user profile operations with D1 database
 */

import { createD1Client } from "@/lib/db";
import { UserProfile } from "@/lib/validators/schema";

/**
 * Syncs user data from Clerk to D1 database
 * Performs an upsert operation (insert or update)
 */
export async function syncUserFromClerk(
  userId: string,
  email: string | null,
  firstName: string | null,
  lastName: string | null,
  profileImageUrl: string | null
): Promise<void> {
  const db = createD1Client();
  const now = Math.floor(Date.now() / 1000); // Unix timestamp in seconds

  await db
    .prepare(
      `INSERT INTO user_profiles (user_id, email, first_name, last_name, profile_image_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         email = excluded.email,
         first_name = excluded.first_name,
         last_name = excluded.last_name,
         profile_image_url = excluded.profile_image_url,
         updated_at = excluded.updated_at`
    )
    .bind(userId, email, firstName, lastName, profileImageUrl, now, now)
    .run();
}

/**
 * Fetches a user profile by user ID
 */
export async function getUserById(userId: string): Promise<UserProfile | null> {
  const db = createD1Client();

  const result = await db
    .prepare(`SELECT * FROM user_profiles WHERE user_id = ?`)
    .bind(userId)
    .first<UserProfile>();

  return result;
}

/**
 * Updates user profile data
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<Omit<UserProfile, "user_id" | "created_at">>
): Promise<void> {
  const db = createD1Client();
  const now = Math.floor(Date.now() / 1000);

  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.email !== undefined) {
    fields.push("email = ?");
    values.push(data.email);
  }
  if (data.first_name !== undefined) {
    fields.push("first_name = ?");
    values.push(data.first_name);
  }
  if (data.last_name !== undefined) {
    fields.push("last_name = ?");
    values.push(data.last_name);
  }
  if (data.profile_image_url !== undefined) {
    fields.push("profile_image_url = ?");
    values.push(data.profile_image_url);
  }

  fields.push("updated_at = ?");
  values.push(now);
  values.push(userId);

  if (fields.length > 1) {
    // More than just updated_at
    await db
      .prepare(`UPDATE user_profiles SET ${fields.join(", ")} WHERE user_id = ?`)
      .bind(...values)
      .run();
  }
}

