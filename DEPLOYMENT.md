# Deployment

## Coolify / Nixpacks

This repository keeps the Vite application in `app/` and includes Nixpacks configurations for both repository layouts:

- **Base Directory:** leave blank (repository root) when using the root `nixpacks.toml`.
- **Alternative Base Directory:** set to `/app` when deploying the `app/nixpacks.toml` configuration.
- **Build Pack:** Nixpacks.
- **Node:** Node 22 (Vite 7 requires Node 20.19 or newer).
- **Exposed port:** `3000` unless Coolify assigns a `PORT` environment variable.
- **Start command:** `cd app && npm run preview` from the repository root. If the Base Directory is `/app`, use `npm run preview`.

The preview server binds to `0.0.0.0`, not only localhost. It uses `PORT` when Coolify supplies one and otherwise defaults to `3000`. This is required so Coolify's reverse proxy and Cloudflare can reach the container.

The Vite preview server also rejects unknown Host headers (DNS-rebinding protection). `app/vite.config.ts` whitelists `agawane.com` and `www.agawane.com` via `preview.allowedHosts`. If the domain ever changes, update that list.

After changing deployment configuration or server scripts, force a fresh deployment rather than only restarting a cached image. Confirm the deployment log contains a listener similar to:

```text
Local:   http://localhost:3000/
Network: http://172.x.x.x:3000/
```

The `npm warn config production Use \`--omit=dev\` instead` message is a warning from the server's npm environment. It is not the cause of a 502 and can be removed by unsetting `NPM_CONFIG_PRODUCTION` or setting it to `false` in the build environment.

## Troubleshooting a 502

1. Redeploy the commit containing the latest `app/vite.config.ts` and `app/package.json`; do not rely on a previously cached image.
2. In Coolify, set the application's exposed port to `3000` if no `PORT` variable is injected.
3. If Coolify injects `PORT`, leave the exposed-port setting aligned with that value; the app will use it automatically.
4. Check the running container logs for `Network: ...:3000` (or the injected port), not only `localhost:4173`.
5. Verify the domain points to the correct Coolify server and that Cloudflare SSL mode is compatible with the origin certificate.
