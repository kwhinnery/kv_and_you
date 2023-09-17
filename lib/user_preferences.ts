import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts";
import * as DenoKV from "./deno_kv.ts";
import * as Redis from "./redis.ts";

export enum Theme {
  Light = "Light",
  Dark = "Dark",
}

export enum Engine {
  DenoKV = "deno",
  DynamoDB = "dynamodb",
  Redis = "redis",
}

// Zod object schema which ensures our data is formatted correctly
const UserPreferences = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  theme: z.nativeEnum(Theme),
});
export type UserPreferences = z.infer<typeof UserPreferences>;

// Wrapper function that performs validation and stores our data using the
// configured backend.
export async function storePreferences(
  prefs: UserPreferences,
  engine: Engine = Engine.DenoKV,
): Promise<UserPreferences | null> {
  // Can throw a ZodError if object config is invalid
  UserPreferences.parse(prefs);

  // Assuming object validation passes, can store with configured engine
  if (engine === Engine.DynamoDB) {
    // TODO
  } else if (engine === Engine.Redis) {
    return await Redis.storePreferences(prefs);
  }

  return await DenoKV.storePreferences(prefs);
}

// Get a user profile, given a username
export async function getPreferences(
  username: string,
  engine: Engine = Engine.DenoKV,
): Promise<UserPreferences | null> {
  if (engine === Engine.DynamoDB) {
    // TODO
  } else if (engine === Engine.Redis) {
    return await Redis.getPreferences(username);
  }

  return await DenoKV.getPreferences(username);
}

// Get a user profile, given an email
export async function getPreferencesByEmail(
  email: string,
  engine: Engine = Engine.DenoKV,
): Promise<UserPreferences | null> {
  if (engine === Engine.DynamoDB) {
    // TODO
  } else if (engine === Engine.Redis) {
    return await Redis.getPreferencesByEmail(email);
  }

  return await DenoKV.getPreferencesByEmail(email);
}
