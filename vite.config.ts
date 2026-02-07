import path from "path"
import react from "@vitejs/plugin-react"
import { inspectAttr } from "kimi-plugin-inspect-react"

export default {
  base: "/me/",
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
}
