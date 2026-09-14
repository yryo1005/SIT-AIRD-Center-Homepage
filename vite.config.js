import { defineConfig } from "vite";
import { resolve } from "path";
import { BASE_PATH, PAGES } from "./site.config.js";

/**
 * GitHub Pagesはリポジトリ名をサブパスとして公開するプロジェクトサイトのため，
 * 本番モード（vite build および vite preview）ではbaseをリポジトリ名に設定する．
 * ローカル開発サーバー（vite dev、modeはdevelopment）ではbaseを"/"のままにする．
 * （command（"build"|"serve"）ではなくmodeで判定する。"vite preview"はcommandが
 * "serve"のためcommandでは本番ビルドと区別できないが，modeは"production"のままになる。）
 *
 * base（このファイル）・PAGES（site.config.js）・cms-shells/のiframe src
 * （scripts/generate-cms-shells.jsがsite.config.jsから生成）は，
 * すべてsite.config.jsを単一の情報源として導出されるため，食い違いが起きない。
 */
export default defineConfig(({ mode }) => {
  const input = {
    devIndex: resolve(__dirname, "index.html"),
  };
  for (const page of PAGES) {
    input[page.key] = resolve(__dirname, page.srcPath);
  }

  return {
    base: mode === "production" ? BASE_PATH : "/",
    build: {
      outDir: "dist",
      rollupOptions: {
        input,
      },
    },
  };
});
