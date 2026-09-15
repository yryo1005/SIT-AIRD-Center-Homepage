# レポート 008

対象指示: `.orders/order_008.md`（チャットでの8点フィードバック）

## 概要

デザイン・可読性まわりの改善6点と，PPTX資料2件にもとづく研究内容の拡充2点を実施した。既存の実績一覧（42件）・教員情報など公式サイト由来の内容は削除・改変していない。

## 実施内容

### 1. ヒーロー背景に「AI R&D CENTER」壁面写真を追加

- `src/pages/top/index.html`のヒーローセクションに`.hero-bg`を新設し，公式サイトの`AICenter_room02.jpg`（ホワイトボードに"AI R&D CENTER"等の落書きがある写真）を背景として配置。
- `src/shared/style.css`に`.hero-bg::after`のグラデーションオーバーレイを追加し，PC版はテキスト側を不透明な白から写真が見える右側へ徐々に透過するグラデーション，モバイル版は上部（テキスト側）を優先して白くする専用グラデーションを設定。
- SVGネット装飾（`.hero-net`）とヒーロー本文（`.hero-inner`）のz-indexを背景写真の上に来るよう再調整（bg → net(z-index:1) → inner(z-index:2)）。
- デスクトップ・モバイル双方でスクリーンショットを撮影し，タイトル文字が背景に負けず可読であることを確認済み（`/tmp/hero_zoom2.png`, `/tmp/hero_zoom2_mobile.png`）。

### 2. ニュース画像の横スライドカルーセル

- `src/data/news.json`に既存の`image`フィールドを持つ記事を対象に，`renderNewsPhotoSlider()`（`src/shared/script.js`）を新設。
- トップページ・ニュースページの両方に`.news-photo-slider > .news-photo-slider-track[data-source="news-json"]`を配置し，画像付き記事を日付降順で描画。
- CSSアニメーション（`@keyframes photo-slider-scroll`，48秒でループ，ホバーで一時停止，`prefers-reduced-motion`時は静止）で横方向に自動スクロール。
- 実装中，スライダー画像に`loading="lazy"`を付けていたためPlaywrightの自動テストで「壊れた画像」誤検知（`naturalWidth: 0`）が発生。実際は外部URLへの`curl`で200が返ることを確認済みで，遅延読み込みが完了する前に評価していたことが原因と特定し，`loading="lazy"`を削除して解消（再検証で0件に）。

### 3. ヘッダー・フッターを公式サイト配色に統一

- 公式サイト（`https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/`）のフッターが濃紺の固定フッターであることを踏まえ，`--official-footer-bg: #0e2d55`・`--official-footer-text: #eaf0fb`・`--official-accent: #4a96ff`を`:root`に追加。
- `.site-footer`・`.footer-nav a`・`.footer-address`をこれらの変数で塗り替え，フッターリンクのホバー色も`--official-accent`に統一。
- ヘッダー（`.site-header`）は元々sticky実装済みのため配色調整のみ確認（変更なし）。

### 4. クリック可能ブロックと非クリックブロックの視覚的差別化

- `.card`（ページ遷移する導線）と`.info-card`（説明・補足のみ）のクラスを既存から踏襲しつつ，違いを強化：
  - `.card`：左端に3pxのアクセントカラー枠線＋常時の薄い box-shadow を追加し，「押せそうな」見た目に。
  - `.info-card`：背景を`--surface-2`（`#eef2fa`）にして`.card`の白背景と区別。加えて右上に`INFO`という小さなラベルバッジ（`::before`疑似要素）を常時表示し，一見して「遷移しない情報ブロック」と分かるようにした。
- `src/pages/embedded/`・`image/`・`nlp/`の研究テーマ説明カード（元は`.card`）を`.info-card`に置換。
- `src/pages/top/index.html`の「参加案内」セクション内，非遷移の3カード（活動のサイクル／対外的な活動／メンバー同士の交流）も`.info-card`に置換。
- スクリーンショットで，画像処理ページ・組込AIページの`.info-card`右上に`INFO`バッジが正しく表示されることを確認済み（`/tmp/zoom_infocard.png`）。

### 5. 全体のフォントサイズ拡大・文字色の濃色化

- `body`のベースフォントサイズを16px→18px，`line-height`を1.75→1.8に変更。
- 本文・ラベル・タグ・リンクなど約20箇所のフォントサイズを1〜2px程度引き上げ（例：`.page-hero-lead`16→18px，`.voice-quote`17→19px，`.card-link`13.5→15px 等）。
- `--text-dim`・`--text-faint`をやや濃い色に調整し，グレー文字の可読性を改善。

### 6. AI Eitaro（`references/AI_Eitaro.pptx`）の内容をNLPページに追加

- PPTXをunzipしてスライドXML（`<a:t>`テキストラン）を抽出し，LibreOffice（`soffice --headless --convert-to pdf`）でPDF化して図表も含めて内容を確認。
- 特定のキャラクター性を持つ学校案内ChatBot「AI Eitaro」について，音声認識（Whisper）・学内情報検索（RAG）・回答生成（ChatGPT）・文書解析（Yomitoku）・音声合成（Zonos）・Flask/Ngrokによるサーバー構成という技術的な要点を`src/pages/nlp/index.html`の`.info-card`として追加。
- スライドに写っていた特定個人が識別できる写真は使用せず，テキストのみで構成。

### 7. 顔変換研究（`references/ディープフェイクとVAEを用いたアイデンティティ保持型匿名化.pptx`）の内容を画像処理ページに追加

- 同様にPPTX抽出・PDF化して内容を確認。
- GHOST（DeepFake技術）とVariational Autoencoder（VAE）を用いた「属性を保持しつつ個人を特定できなくする」匿名化手法について，課題設定（デジタルタトゥー問題，従来手法の限界）・提案手法・評価方法（UTKFaceデータセット，性別一致率／年齢誤差／顔類似度による定量評価）を`src/pages/image/index.html`の`.info-card`として追加。
- 使用画像は公式サイトに既に掲載されている`aicenter003.png`（研究のイメージ図）を使用し，研究発表スライド内の実在人物の顔写真は使用していない。
- 研究者名（山富龍・二宮洋）はスライド記載のクレジットをそのまま転記。

### 8. 各分野ページの内容を濃いめに

- 上記6・7の追加に加えて，画像処理・NLPページの既存カードの説明文を見直し，具体的な技術要素・数値（データセット規模，評価指標等）を含む記述に強化した（内容は既存資料の範囲内で，事実の捏造は行っていない）。

## 検証

- `npm run build` 成功。
- Playwrightによる全8ページの自動チェック（`check_v4.js`）：画像破損0件，コンソールエラー0件。
- `npm run verify:cms-shells`：全ページ整合性OK。
- スクリーンショットによる目視確認：トップページのヒーロー（PC/モバイル），ニュース一覧・トップの写真スライダー，フッター配色，`.card`/`.info-card`の視覚差（INFOバッジ含む），全8ページのフルページレイアウト崩れの有無を確認。

## 既知の課題・次のステップ

- `students.json`・`theses.json`は`order_007`時点の設計案のまま未実装（次フェーズ予定）。
- 強化学習ページは引き続き「準備中」のプレースホルダーのまま（該当PPTX資料が未提供のため）。
- GitHub認証情報がこの作業環境に保存されていないため，コミット後の`git push`は失敗する見込み。ユーザー側での`git pull`＋手元環境からのpush，または`gh auth login`の設定をお願いしたい（過去のセッションと同様）。
