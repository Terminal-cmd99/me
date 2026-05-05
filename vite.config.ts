import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { inspectAttr } from "kimi-plugin-inspect-react"

const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages"

export default defineConfig({
  base: isGitHubPages ? "/me/" : "/",
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
})
