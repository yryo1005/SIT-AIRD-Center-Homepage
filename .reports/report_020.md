# レポート 020

対象指示: `.orders/order_020.md`（AIデモ一覧の説明・体験用リンクの追加）

## 概要

AI R&D Centerが作成したオープンキャンパス用AIデモ（`https://github.com/yryo1005/OpenCampus_Demo`）の内容を確認し，各デモの説明とColabで体験できるリンクを，在学生の方へページ・高校生の方へページの両方に追加した。

## 実施内容

### 1. リポジトリ内容の確認

`https://api.github.com/repos/yryo1005/OpenCampus_Demo/contents`および`raw.githubusercontent.com`経由で，リポジトリの内容を確認した。11件のAIデモ（`.ipynb`＋説明用`.md`が対）を特定した。

| デモ | 主な技術 | リアルタイム版 |
| :--- | :--- | :--- |
| 全身ランドマーク検出 | MediaPipe Pose Landmarker | あり |
| AI着色 | DDColor | あり |
| 深度推定 | Depth Anything V2 | あり |
| 顔ランドマーク検出 | MediaPipe Face Landmarker | あり |
| 顔スタイル変換 | AnimeGANv2 | あり |
| 表情認識 | Vision Transformer | あり |
| 手書き文字認識 | YomiToku | なし |
| 画像生成 | Stable Diffusion v1.5 | なし（Gemini APIキーが必要） |
| 音楽生成 | MusicGen | なし（Gemini APIキーが必要） |
| セグメンテーション | Segment Anything | あり |
| 音声認識 | Whisper | なし |

各デモの説明文は，対応する`OC_XXX.md`（「高校生向けオープンキャンパス用の，〜デモです．」という書き出しで統一されている，実施者向けの操作説明ファイル）の記載内容に基づいて作成し，新たな推測は加えていない。画像生成・音楽生成の2件については，`OC_ImageGen.md`／`OC_MusicGen.md`に「API キー：**Gemini が必要**」と明記されていることを確認し，「体験にはご自身のAPIキーの準備が必要です」という注記をカードに追加した。

### 2. データファイル化

`src/data/demos.js`（`DEMOS`配列）を新設し，各デモを`{ key, title, tag, description, apiKeyNote, links }`の形で構造化した。`src/shared/script.js`に`renderDemoList()`を追加し，joinページ・for-highschoolページ両方の`.card-grid[data-source="demos-json"]`へ同じ内容を描画するようにした。既存の学生の声（`students.js`）・研究内容（`research/`）・業績一覧（`publications.js`）と同じ「1箇所のデータソースを複数ページで共有する」設計パターンに合わせている。

### 3. リンク形式

「デモを体験する」という目的に対して最も適した形式として，GitHub上のファイル閲覧ページ（`github.com/.../blob/main/...`）ではなく，Google Colabで直接開ける`https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/<ファイル名>`という形式のURLを採用した。実際に対象ファイルが存在することを`raw.githubusercontent.com`へのHTTPリクエストで確認済み。

### 4. ページへの追加

- joinページ：「身につくスキル・卒業後の進路」（08）の後，「よくある質問」の前に，新規セクション「AIデモを体験しよう」（09 / Demos）を追加した。以降の「よくある質問」「先輩の声」のセクション番号を1つずつ繰り下げた。
- for-highschoolページ：「身につく力・卒業後の進路」の後，「先輩の声」の前に，同じ内容のセクションを追加した（このページは元々`section-index`を使っていないため，番号の振り直しは発生していない）。
- どちらのセクションにも，リポジトリ自体へのリンク（`https://github.com/yryo1005/OpenCampus_Demo`）をsection-lead文中に併記した。

## 検証

- `npm run build`：成功。
- `npm run verify:cms-shells`：cms-shells 7ファイル，README.md記載URL 7件すべてOK。
- Playwrightによる全7ページの自動チェック：画像破損0件（遅延読み込み画像はスクロールして読み込み確認済み），コンソールエラー0件。
- joinページ・for-highschoolページの両方で，11件のデモカードが正しく描画され，画像生成・音楽生成のカードにのみAPIキーに関する注記が表示されることを確認した。
- Colabリンクの形式（`colab.research.google.com/github/...`）が全カードで正しく生成されていることを確認した。

## 既知の課題・次のステップ

- 実際にColabリンクを開いてノートブックが正常に起動するかまでは，この作業環境から動作確認できていない（Google Colabへのサインインが必要なため）。リンク先ファイルの存在自体はHTTPリクエストで確認済みである。
- GitHub認証情報がこの作業環境に保存されていないため，コミット後の`git push`は失敗する見込み。ユーザー側での`git pull`＋手元環境からのpush，または`gh auth login`の設定をお願いしたい。
