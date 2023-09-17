/** @jsx jsx */
import { Hono } from "https://deno.land/x/hono@v3.5.6/mod.ts";
import { jsx } from "https://deno.land/x/hono@v3.5.6/middleware.ts";
import {
  deleteCookie,
  getCookie,
  setCookie,
} from "https://deno.land/x/hono@v3.5.6/helper.ts";
import {
  Engine,
  getPreferences,
  getPreferencesByEmail,
  storePreferences,
  Theme,
  UserPreferences,
} from "./lib/user_preferences.ts";

// Determine which KV backend to use
const engine: Engine = Deno.env.get("KV_STORAGE_ENGINE") as Engine ??
  Engine.DenoKV;

const app = new Hono();

app.get("/", async (c) => {
  const username = c.req.query("username");
  const email = c.req.query("email");
  let p: UserPreferences | null = null;

  if (username) {
    p = await getPreferences(username, engine);
  } else if (email) {
    p = await getPreferencesByEmail(email, engine);
  }

  // Handle any flash messages via cookie
  const flashMessage = getCookie(c, "flash_success");
  deleteCookie(c, "flash_success");
  const flashError = getCookie(c, "flash_error");
  deleteCookie(c, "flash_error");

  return c.html(
    <html>
      <head>
        <title>User Preferences Demo</title>
        <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css">
        </link>
      </head>
      <body>
        <main style={{ maxWidth: 600, margin: "0 auto" }}>
          <h1>User Preferences</h1>
          {flashMessage
            ? (
              <p
                style={{
                  border: "1px solid green",
                  color: "green",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
                {flashMessage}
              </p>
            )
            : ""}
          {flashError
            ? (
              <p
                style={{
                  border: "1px solid red",
                  color: "red",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
                {flashError}
              </p>
            )
            : ""}
          <form
            action="/preferences"
            method="POST"
          >
            <label for="username">Username:</label>
            <input type="text" name="username" value={p?.username} required>
            </input>

            <label for="email">E-Mail:</label>
            <input type="email" name="email" value={p?.email} required></input>

            <label for="theme">UI Theme:</label>
            <select name="theme">
              {Object.values(Theme).map((t) => {
                return <option value={t} selected={t === p?.theme}>{t}</option>;
              })}
            </select>

            <button
              type="submit"
              style={{
                display: "block",
                margin: "5px 0",
              }}
            >
              Update Preferences
            </button>
          </form>
        </main>
      </body>
    </html>,
  );
});

app.post("/preferences", async (c) => {
  const prefs = await c.req.parseBody<UserPreferences>();
  let savedPrefs;
  try {
    savedPrefs = await storePreferences(prefs, engine);
    if (!savedPrefs) {
      setCookie(c, "flash_error", "Prerences not saved :(");
    } else {
      setCookie(c, "flash_success", "Preferences saved!");
    }
  } catch (e) {
    setCookie(c, "flash_error", e.message);
    console.error(e);
  }

  return c.redirect(`/?username=${savedPrefs?.username ?? ""}`, 303);
});

Deno.serve(app.fetch);
