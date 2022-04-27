import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

// this is only used to build background.js file
export default defineConfig({
	plugins: [solidPlugin()],
	build: {
		target: "esnext",
		polyfillDynamicImport: false,
		emptyOutDir: true,
		assetsDir: "public",
		rollupOptions: {
			input: "src/index.tsx",
			output: {
				assetFileNames: "[name].[ext]",
				chunkFileNames: "public/[name].js",
				entryFileNames: "public/[name].js",
				manualChunks: undefined,
				format: "module",
				dir: "dist",
			},
		},
	},
});
