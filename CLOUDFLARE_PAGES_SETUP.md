# Cloudflare Pages Setup

1. Create a new Cloudflare Pages project from this repository.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Add a production secret named `OPENAI_API_KEY`.
5. Deploy the project.

## Auto Deploy From GitHub

The repository includes `.github/workflows/cloudflare-pages.yml`.

To enable deployment on every push to `main`:

1. Create a Cloudflare API token with permission to deploy Pages.
2. Add it to the GitHub repository secrets as `CLOUDFLARE_API_TOKEN`.
3. Push to `main` or run the workflow manually from GitHub Actions.

The workflow deploys to the Cloudflare Pages project named `me`.

Notes:
- The chatbot calls `functions/api/chat.ts` on the same domain at `/api/chat`.
- The OpenAI model is `gpt-5.4-nano`.
- Chat history is stored in Cloudflare D1 database `me-chat` through the `CHAT_DB` binding.
- The admin history page is `/backend/`. It uses `ADMIN_PASSCODE` if configured, otherwise the fallback passcode is `0000`.
- `vite.config.ts` now defaults to root path `/` for Cloudflare Pages.
- If you still build for GitHub Pages, use `DEPLOY_TARGET=github-pages npm run build`.
