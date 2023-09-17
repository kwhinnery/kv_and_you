# Key/Value Databases and You

This is the example code for Kevin's "Key/Value Databases and You" presentation,
showing how to interact with different key/value databases in TypeScript.

## Local development

Install the
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

## License

MIT
