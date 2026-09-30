# Render Deployment

Tribal Saksham AI is a separate repository and deployment from Yatra.
All paths below are relative to this repository, not the parent workspace.

## Demo Only

- Authentication is mocked: passwords are not verified, bearer values are predictable user IDs, and demo role switching is public. A JWT secret does not fix this implementation.
- Records are stored in memory and reset on restart, redeploy or free-service spin-down. Local uploads are not durable either.
- Use synthetic data only. Do not enter real student records, identity documents, bank details or credentials.
- Real authentication, server-side authorization, persistent storage and dependency security review are required before real use. The locked Multer 1.x dependency emits a known-vulnerability warning during installation; no security audit or upgrade is included here.
- AI remains in demo mode. This configuration does not enable a model provider.

## Deploy With Blueprint

1. Use the separate repository https://github.com/Zyora-Dev/scholar on branch `main`, the user-approved publication destination. The original source repository is retained as the local `upstream` remote.
2. In Render, select **New > Blueprint** and connect that repository and branch. Use `render.yaml` at its root, not Yatra's Blueprint.
3. Review the proposed resources: `tribal-saksham-api` is a free Node web service; `tribal-saksham-web` is a static site. No database, disk or paid compute is requested. Check current account limits and pricing before applying.
4. Apply the Blueprint to begin deployment. The API uses `server/`, builds with `npm ci --include=dev && npm run build`, and starts with `npm start`. It reads Render's `PORT`; health checks use `/api/health`.
5. The static site uses `client/`, the same build command, and publishes `dist/`. `VITE_API_URL` references the API service's `RENDER_EXTERNAL_URL`, which must be the public HTTPS origin without an `/api` suffix. Never use Render's private hostname in browser configuration.
6. Confirm the static site's environment contains the actual API origin before accepting the deployment. If the value changes, rebuild the static site because Vite embeds it at build time.

The `/*` rewrite to `/index.html` supports direct visits and refreshes on React routes. Render serves the site at `/`, so no GitHub Pages basename or Vite project-path base is needed. API requests go directly to the API origin. The current demo API allows cross-origin requests; that permissive policy is not a security boundary.

Automatic Render deployment is disabled. After later approved pushes, use **Manual Deploy > Deploy latest commit** on the affected service(s). GitHub Actions now builds both packages but does not publish GitHub Pages. Any already-published Pages site remains until disabled in GitHub repository settings.

## Manual Setup Alternative

If you create services individually, use these same settings:

| Setting | API web service | Frontend static site |
| --- | --- | --- |
| Root directory | `server` | `client` |
| Build command | `npm ci --include=dev && npm run build` | `npm ci --include=dev && npm run build` |
| Start command | `npm start` | Not applicable |
| Publish directory | Not applicable | `dist` |
| Node version | `NODE_VERSION=22` | `NODE_VERSION=22` |
| Other environment | `NODE_ENV=production`, `AI_MODE=demo` | `VITE_API_URL` set to the actual API HTTPS origin |
| Health path | `/api/health` | Not applicable |

Add a frontend rewrite: source `/*`, destination `/index.html`, action **Rewrite**. Deploy the API first so you can use its actual URL, then build the frontend. Keep any future provider secrets on the backend, never in `VITE_*` variables.

## Verification And Rollback

- Open the API's `/api/health` path and confirm `status: HEALTHY` and `aiMode: demo`.
- Open the frontend, use the demo student login, and confirm scholarship and dashboard requests reach the actual API origin and return JSON rather than HTML.
- Refresh `/student/dashboard` directly and verify the SPA loads. Exercise role switching only with demo data.
- Expect a cold-start delay on a free web service. In-memory changes may disappear when it restarts.
- If a deployment fails, inspect that service's build/runtime logs. Keep the previous working deployment active or redeploy its known-good commit. Rolling back cannot recover in-memory records.

Local builds and tests do not verify Render provisioning, its Node 22 runtime, public URL resolution, TLS, cross-origin behavior or hosted rewrites. Those require post-deployment checks.