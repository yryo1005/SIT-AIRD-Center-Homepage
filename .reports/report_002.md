# report_002：AI R&D Center Webサイト再構築プロジェクト（v2）実施レポート

対応する指示書：`.orders/order_002.md`

## 1. 実施内容の概要

v1（`.orders/order_001.md`）で作成したArtisCMS3直接貼り付け方式を，本指示書にもとづきGitHub Pages＋iframe埋め込み方式へ全面移行した。あわせて，v1で報告されていた文字化けの原因を特定・修正した。作業対象は既存のPublicリポジトリ`https://github.com/yryo1005/SIT-AIRD-Center-Homepage`（新規リポジトリは作成していない）である。

## 2. 参照元情報について

参照元8ページの内容は，前回セッション（`.reports/report_001.md`）で全件取得・整理済みであり，ユーザーの確認も得ていたため，本フェーズでは再取得を行わず，前回確認済みの内容をそのまま踏襲してコンテンツを作成した。参照元URL・取得内容自体に変更はない。

## 3. 文字化けの原因特定と修正

### 原因

v1で作成した`pages/*/index.html`・`dist/*.html`は，`<!DOCTYPE html>`や`<head>`を持たないHTMLフラグメントであり，`<meta charset="UTF-8">`の宣言が存在しなかった。ファイル自体はBOMなしUTF-8で正しく保存されていることを`file`コマンド・`xxd`コマンドで確認したが，HTTPレスポンスヘッダで`charset=utf-8`が明示されない配信経路（ローカルファイルを直接開く，GitHubのraw表示，一部の静的ホスティングなど）では，ブラウザがエンコーディングを推測してしまい，文字化けが発生する状態であった。

### 修正内容

v2では全8ページを，`<meta charset="UTF-8">`を`<head>`の最初の子要素として持つ完全なHTMLドキュメントとして再構成した。これにより，配信経路のHTTPヘッダの状況に関わらず，ブラウザが文字コードを一意にUTF-8と判定できるようになり，根本的に解消した。あわせて，全ソースファイル（.html/.css/.js/.md）がBOMなしUTF-8で保存されていることを`xxd`コマンドで再確認した。Viteのビルド出力（`dist/`配下）についても，実際にビルドしブラウザで表示して日本語が正しく表示されることを確認済みである（詳細は5節）。

## 4. アーキテクチャ移行の内容

### ディレクトリ構成の変更

v1の`pages/`・`shared/`・`build.js`・`dist/`（インライン展開によるArtisCMS3直接貼り付け方式）を削除し，以下を新設した。

```
src/shared/style.css, script.js
src/pages/{top,news,facility,basic-research,embedded,image,nlp,reinforcement}/index.html
index.html（ローカル確認専用の開発用インデックス）
vite.config.js
cms-shells/{top,news,facility,basic-research,embedded,image,nlp,reinforcement}.html
.github/workflows/deploy.yml
package.json（Viteベースへ刷新）
```

### リンク・パスのルール

ページ間の内部リンクは，指示書のとおりドメイン名を含まないルート相対パスとし，すべてに`target="_top"`を付与した（内部ナビゲーションに加え，指導教員の個別プロフィールリンクや公式お問い合わせリンクなど，iframe内から大学ドメインへ遷移するすべてのリンクに付与している）。画像は前回同様，公式サイトの画像URLを絶対パスで参照している。

### iframe高さ自動調整

`src/shared/script.js`に`initIframeHeightReporter()`を追加した。`window.self !== window.top`（iframe埋め込み状態）のときのみ動作し，`ResizeObserver`で`document.body`の高さ変化を検知して，`window.parent.postMessage({ type: "ai-rd-center:height", height }, "*")`で親ウィンドウへ通知する。`cms-shells/*.html`側は対応する`message`イベントを受信し，`iframe`要素の高さを更新する。

### GitHub Actionsによる自動デプロイ

`.github/workflows/deploy.yml`を実装した。`main`ブランチへのpush（および手動実行）をトリガーに，`actions/checkout` → `actions/setup-node`（Node.js 20） → `npm ci` → `npm run build` → `actions/upload-pages-artifact` → `actions/deploy-pages`の順で実行し，GitHub Pagesへ自動デプロイする構成である。

## 5. 動作確認結果

### Vite開発サーバー（`npm run dev`）

Node.js v20.17.0（実行環境に`node`が存在しなかったため，ユーザー権限で一時的に導入）を用いて`npm install`（`vite`のみを依存関係として追加）後，`npm run dev`を実行し，全8ページがコンソールエラーなしで表示されることをPlaywright（Chromium）で確認した。日本語表示・ダークテーマ＋青ハイライトのデザイン・アコーディオンのクリック開閉が正常に動作することをスクリーンショットで確認済みである。

### 本番ビルド（`npm run build`）

```
dist/index.html                            1.71 kB
dist/src/pages/reinforcement/index.html    4.34 kB
dist/src/pages/nlp/index.html              4.66 kB
dist/src/pages/image/index.html            4.83 kB
dist/src/pages/embedded/index.html         4.89 kB
dist/src/pages/facility/index.html         5.73 kB
dist/src/pages/news/index.html             9.26 kB
dist/src/pages/top/index.html             12.55 kB
dist/src/pages/basic-research/index.html  15.26 kB
dist/assets/script-BGlIrHdM.css           12.07 kB
dist/assets/script-CmY2fXhE.js             2.48 kB
✓ built in 216ms
```

ビルドは問題なく完了した。出力パスは`dist/src/pages/<ページ名>/index.html`となることを確認し，`cms-shells/`のiframe `src`（GitHub Pages公開URL）をこの構成に合わせて記述した。

### 本番ビルドのプレビュー（`npm run preview`）とiframe埋め込みの実地検証

当初，`vite.config.js`で`base`の切り替え条件を`command === "build"`としていたため，`vite preview`（`command`は`"serve"`）では`base`が`"/"`のままになり，`/SIT-AIRD-Center-Homepage/...`宛のリクエストがSPAフォールバックにより誤って開発用インデックスページを返す不具合を検出した。原因を切り分けたうえで，判定条件を`mode === "production"`（`vite build`・`vite preview`はともに`production`モードで動作し，`vite dev`のみ`development`モードになる）に修正し，解消したことを確認した。

修正後，`npm run preview`で本番相当のサーバーを起動し，別オリジン（`localhost`の別ポート）に置いたテスト用iframeシェルから`http://127.0.0.1:4173/SIT-AIRD-Center-Homepage/src/pages/top/index.html`を読み込ませ，以下を確認した。

- iframeの中身（トップページ）が文字化けなく正しく表示されること
- `postMessage`によるクロスオリジンの高さ通知が機能し，親ウィンドウ側のiframeの高さが実際の本文の高さ（5743px）に自動調整されること

## 6. 未解決の論点・次に検討すべき作業

- 本レポート作成時点では，まだGitHub Pagesへの実デプロイ・GitHub Actionsワークフローの実行結果（Settings → PagesでのSource設定を含む）を確認できていない。次回セッションでpush後のActions実行結果と，実際のGitHub Pages URL（`https://yryo1005.github.io/SIT-AIRD-Center-Homepage/...`）での表示を確認する必要がある。
- `npm audit`で`esbuild`（Viteの依存）に関するmoderateな脆弱性（開発サーバーに対するCORSの脆弱性，本番ビルド・GitHub Pages配信には影響しない）が1件報告されている。対処には`vite`のメジャーバージョンアップ（v5→v6）が必要であり，破壊的変更を伴う可能性があるため，本フェーズでは対応を見送った。次フェーズで検証のうえアップグレードを検討する。
- ArtisCMS3側への実際の`cms-shells/`貼り付け作業，および貼り付け後のCMS編集画面での文字コード確認は運用者による手動作業であり，未実施である。
- README.mdの「ArtisCMS3側ページURLとの対応表」は，指示書のとおり空欄のままとしており，運用者による手動記入が必要である。
- 次フェーズ（指示書スコープ外）として，PDF/PPTXなどアップロード資料からの情報・画像抽出，GitHub Releaseを用いた画像の外部ホスティングへの切り替えが残っている。

## 7. ローカルからのアクセス方法

```bash
npm install
npm run dev       # http://localhost:5173/ からローカル確認
npm run build     # dist/へ本番ビルド
npm run preview   # http://localhost:4173/SIT-AIRD-Center-Homepage/ で本番相当を確認
```

詳細な手順・各ページのURL一覧は`README.md`を参照。
