# Key/Value Databases and You

This is the example code for Kevin's "Key/Value Databases and You" presentation,
showing how to interact with different key/value databases in TypeScript.

## Local development

After
[cloning this repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository),
install the
[Deno runtime](https://docs.deno.com/runtime/manual/getting_started/installation).
This is all you strictly need to run the demo application with Deno KV (built in
to Deno). Run the demo app with:

```
deno task run
```

The demo app will be available on [localhost:8000](http://localhost:8000).

### Using Redis

If you'd like to run this application using Redis as a storage backend,
[install Redis locally](https://redis.io/docs/getting-started/installation/) and
run it with the default configuration. With Redis running, launch the demo app
with:

```
deno task run_redis
```

This will set the app up to use Redis instead of Deno KV.

### Optional: Install the Deno VS Code extension

You may find local development more ergonomic using VS Code and the official
[Deno VS Code extension](https://docs.deno.com/runtime/manual/references/vscode_deno).
This repo already has a `.vscode` directory with some useful default settings.

## Workshop challenges

Are you hanging out with Kevin at a live workshop? If so, you will have some
unstructured free time to work on modifications to this project, and ask any
questions that you might have along the way. If you complete any three of the
challenges described below during the workshop, wave Kevin over and show him. If
you've done it, you can email him your mailing address to receive a fabulous
prize package from your friends at [Deno](https://deno.com)!

### Challenge 1: Run with both Deno KV and Redis

This project is set up to work with Deno KV with basically zero configuration -
but using it with Redis isn't actually all that much harder. Install Redis
locally and use the `deno task run_redis` command to use that database instead.

### Challenge 2: Port to Node.js

This example app uses Deno, so TypeScript and JSX are supported without
configuration or external dependencies. However, 98% of the code in this repo
would run just fine in Node.js (with
[ESM module settings](https://nodejs.org/api/esm.html#enabling)) using
additional configuration and third party dependencies. To complete this
challenge, you'd need to do the following:

- Set up a `package.json` to manage dependencies and run scripts (found in
  `deno.jsonc` in this repo)
- Replace any HTTPS imports in source files (like Hono and Zod) with
  npm-compatible imports
- Set up a TypeScript compiler to transform TS files in `/lib`
- Replace `server.tsx` with a JavaScript/TypeScript only server that doesn't use
  JSX (like [Fastify](https://fastify.dev/), say) to render both of the server
  routes. Alternately, you can use Hono in
  [Node.js compat mode](https://hono.dev/getting-started/nodejs).

### Challenge 3: Add another preference

Update the UI and models to add another field to the user preferences model.
This can be anything you want - maybe a locale preference like `en-GB`? To do
this, you'd need to:

- Update `server.tsx` to add additional form fields and pass in additional
  inputs
- Update the `UserPreferences` type in `lib/user_preferences.ts` to add an
  additional field to the model

### Challenge 4: Add a new secondary index

Right now, this application is set up to have two indexes that can be used to
look up user preference data - a username and an email. To complete this
challenge, you must add a third (maybe a phone number in
[E.164 format](https://www.twilio.com/docs/glossary/what-e164)). To complete
this challenge, you must:

- Update `server.tsx` to add additional form fields and pass in additional
  inputs
- Update the `UserPreferences` type in `lib/user_preferences.ts` to add an
  additional field to the model
- Update the wrapper functions in `lib/deno_kv.ts` or `lib/redis.ts` to store
  and read data from a third index

## License

MIT
