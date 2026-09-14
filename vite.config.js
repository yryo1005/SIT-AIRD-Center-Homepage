import { defineConfig } from "vite";
import { resolve } from "path";

/**
 * GitHub Pagesはリポジトリ名をサブパスとして公開するプロジェクトサイトのため，
 * 本番モード（vite build および vite preview）ではbaseをリポジトリ名に設定する．
 * ローカル開発サーバー（vite dev、modeはdevelopment）ではbaseを"/"のままにする．
 * （command（"build"|"serve"）ではなくmodeで判定する。"vite preview"はcommandが
 * "serve"のためcommandでは本番ビルドと区別できないが，modeは"production"のままになる。）
 */
export default defineConfig(({ mode }) => {
  return {
    base: mode === "production" ? "/SIT-AIRD-Center-Homepage/" : "/",
    build: {
      outDir: "dist",
      rollupOptions: {
        input: {
          devIndex: resolve(__dirname, "index.html"),
          top: resolve(__dirname, "src/pages/top/index.html"),
          news: resolve(__dirname, "src/pages/news/index.html"),
          facility: resolve(__dirname, "src/pages/facility/index.html"),
          "basic-research": resolve(__dirname, "src/pages/basic-research/index.html"),
          embedded: resolve(__dirname, "src/pages/embedded/index.html"),
          image: resolve(__dirname, "src/pages/image/index.html"),
          nlp: resolve(__dirname, "src/pages/nlp/index.html"),
          reinforcement: resolve(__dirname, "src/pages/reinforcement/index.html"),
        },
      },
    },
  };
});
