import { UserPreferences } from "./user_preferences.ts";

const kv = await Deno.openKv();

export async function storePreferences(
  prefs: UserPreferences,
): Promise<UserPreferences | null> {
  // Create primary and secondary keys for user preference data
  const primaryKey = ["preferences", prefs.username];
  const secondaryKey = ["preferences_by_email", prefs.email];

  // Set primary and secondary index in a transaction
  const res = await kv.atomic()
    // Primary key contains the actual data
    .set(primaryKey, prefs)
    // Secondary key contains data to build the primary key
    .set(secondaryKey, prefs.username)
    // Execute both operations
    .commit();

  return (res.ok) ? prefs : null;
}

// Get preferences by username, which is our primary key
export async function getPreferences(
  username: string,
): Promise<UserPreferences | null> {
  // Create primary key for user preference data
  const primaryKey = ["preferences", username];
  const res = await kv.get<UserPreferences>(primaryKey);
  return res.value;
}

// Get preferences by email, which is our secondary key - requires two lookups
export async function getPreferencesByEmail(
  email: string,
): Promise<UserPreferences | null> {
  // Fetch primary key using secondary key
  const secondaryKey = ["preferences_by_email", email];
  const res = await kv.get<string>(secondaryKey);

  // If no secondary key exists, bail early
  if (!res.value) {
    return null;
  }

  // Otherwise, attempt to look up by primary key
  return getPreferences(res.value);
}
