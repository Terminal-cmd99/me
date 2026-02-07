export default defineConfig({
  base: '/me/', // 👈 ต้องตรงชื่อ repo
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
