import { createClient } from "npm:redis@4";
import { UserPreferences } from "./user_preferences.ts";

// Connect to local redis
const client = createClient();

try {
  await client.connect();
} catch {
  console.warn("WARNING: Could not connect to local Redis.");
  console.warn("Redis storage engine will be unavailable.");
}

export async function storePreferences(
  prefs: UserPreferences,
): Promise<UserPreferences | null> {
  // Create primary and secondary keys for user preference data
  const primaryKey = ["preferences", prefs.username].join(":");
  const secondaryKey = ["preferences_by_email", prefs.email].join(":");

  const [r1, r2] = await client.multi()
    .set(primaryKey, JSON.stringify(prefs))
    .set(secondaryKey, primaryKey)
    .exec();

  if (r1 === "OK" && r2 === "OK") {
    return prefs;
  } else {
    return null;
  }
}

// Get preferences by username, which is our primary key
export async function getPreferences(
  username: string,
): Promise<UserPreferences | null> {
  // Create primary key for user preference data
  const primaryKey = ["preferences", username].join(":");
  const res = await client.get(primaryKey);
  if (res) {
    return JSON.parse(res) as UserPreferences;
  } else {
    return null;
  }
}

// Get preferences by email, which is our secondary key - requires two lookups
export async function getPreferencesByEmail(
  email: string,
): Promise<UserPreferences | null> {
  // Fetch primary key using secondary key
  const secondaryKey = ["preferences_by_email", email].join(":");
  const res1 = await client.get(secondaryKey);

  // If no secondary key exists, bail early
  if (!res1.value) {
    return null;
  }

  const res2 = await client.get(res1);
  if (res2) {
    return JSON.parse(res2) as UserPreferences;
  } else {
    return null;
  }
}
