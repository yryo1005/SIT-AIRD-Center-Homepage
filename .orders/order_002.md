# AI R&D Center Webサイト再構築プロジェクト 指示書 (v2)

## 0. これは何か

湘南工科大学 情報学部 の「AI R&D Center」紹介ページを再構築するプロジェクトです。

現状は公式サイト内に分散している複数のページ（トップ・ニュース・施設・研究分野ごとのページなど）を、内容を維持・拡充しながら1つの見やすいデザインに統合し、GitHub上でソースを管理しながら開発します。

**公開の仕組み**：本体（HTML/CSS/JS）はGitHub Pagesでホストし、大学のCMS（ArtisCMS3）側の各ページには「そのGitHub Pagesの該当ページを表示するiframe」だけを1回貼り付けます。以降はGitHubにpushするだけでサイト全体が更新される運用にします（詳細は8章）。

**このフェーズでは、アップロードされたファイル（PDF/PPTXなどのガイダンス資料）は使用しません。参照元は下記の公式サイトのみとしてください。**

## 1. リポジトリ

以下のリポジトリがすでに作成・Public公開済みです。これを作業対象のリポジトリとして使用してください（新規にリポジトリを作らないこと）。

- https://github.com/yryo1005/SIT-AIRD-Center-Homepage

## 2. 参照元（この範囲だけを情報源にする）

以下のページの内容を読み込み、テキスト・画像URL・リンク構造を正確に把握してください。

- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/ （トップ）
- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/news/ （ニュース一覧）
- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/facility/ （施設紹介）
- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/basick_reserch/ （基礎研究、業績一覧を含む）
- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/embedded/ （組込）
- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/image/ （画像処理）
- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/nlp/ （NLP）
- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/reinforcement/ （強化学習。現時点でほぼ内容がないことは確認済み。空でも良いので存在は反映する）

上記ページ内でリンクされている指導教員の個別プロフィールページも、名前・肩書の裏取りのために参照してよい。

**厳守事項：現状の公式サイトに書かれている情報（数値、人名、日付、研究タイトル、業績一覧など）は一切欠落・改変させないこと。** 文章を要約・言い換えするのは良いが、事実関係を削ってはいけない。「内容を守る」ことを最優先とする。

## 3. サイト構成（情報設計）

以下のページ構成で作成する。カッコ内は最終的にArtisCMS3上で公開される想定のURLパス（公式サイトの現行構造を踏襲する）。GitHub Pages上のパスとCMS上のパスは一致しなくてよい（8章のiframe方式で吸収する）。

1. トップ (`/faculties/research-center/ai_rd_center/`)
2. ニュース (`/faculties/research-center/ai_rd_center/news/`)
3. 指導教員（トップ内のセクションでよいが、教員ごとの詳細情報を厚めに）
4. 施設 (`/faculties/research-center/ai_rd_center/facility/`)
5. 研究活動：以下5つは既存の構造を踏襲しつつ、それぞれ独立ページとして厚みを持たせる
   - 基礎研究 (`/faculties/research-center/ai_rd_center/basick_reserch/`)
   - 組込 (`/faculties/research-center/ai_rd_center/embedded/`)
   - 画像処理 (`/faculties/research-center/ai_rd_center/image/`)
   - NLP (`/faculties/research-center/ai_rd_center/nlp/`)
   - 強化学習 (`/faculties/research-center/ai_rd_center/reinforcement/`)（情報が薄い旨を正直に明記する「準備中」ページでよい）
6. お問い合わせ（トップ内のセクションでよい。実際に送信できるフォームは作らず、公式のお問い合わせページへ誘導するリンクにする）

すべてのページに共通のヘッダー（ナビゲーション）・フッターを持たせ、相互にリンクさせる。

## 4. コンテンツを厚くする方針（内容を「守りながら」広げる）

単なる要約ではなく、以下の観点で厚みを持たせる。ただし新規に事実を捏造しないこと。公式サイトに実在する情報の中から掘り起こす・目立たせる、という方針。

- **学生の声**：基礎研究ページに実在する学生のコメント（将棋の棋譜分類研究、SNMF研究、Hutchinson手法の研究など）を独立したセクションとして目立たせる
- **研究活動の深掘り**：各研究テーマについて、既存の説明文に加えて発表者名・年度・学会名など既存情報を整理して見せる
- **業績一覧（基礎研究ページの約40件）**：全件を保持しつつ、量が多いので開閉式（アコーディオン）などで読みやすくする
- **参加案内（新設）**：公式サイトの「学生が主体となって活動している」という記述をもとに、参加を考えている学生向けの案内セクションを設ける。ただし参加方法・条件など公式サイトに書かれていない具体的な手続きは断定的に書かず、「詳細はお問い合わせください」等に留める
- **実績サマリー（新設）**：学会発表件数・受賞歴など、業績一覧から集計できる数値をハイライトとして見せる

## 5. デザイン方針

- **配色：背景は黒（または黒に近いダークトーン）を基調とし、文字のハイライト・アクセントカラーには青系の色を使用する。**
- 見出しにセリフ体（Fraunces等）、本文にサンセリフ（Inter等）、日付・ラベル・数値にモノスペース（IBM Plex Mono等）を使い分ける、知的な研究ラボ・学術誌のような雰囲気
- 学生主体の活動であることが伝わる、親しみと専門性のバランスが取れたトーン
- 汎用テンプレート感のある「ありきたりな配色・構成」は避ける。frontend-designに関するスキルがあれば参照すること
- モーションは意味のある箇所にだけ使う（8章で許可するライブラリの節度ある利用を含む）。`prefers-reduced-motion`への配慮は必須

## 6. 技術要件

### プロジェクト構成（Viteベースに変更）

GitHub Pagesでホストする前提になったため、ArtisCMS3への直接貼り付けを意識した「単一HTML化」の制約は不要になった。モダンな開発体験を優先し、Viteを使ったビルド構成にする。

```
project/
├── src/
│   ├── shared/           ← 共通ヘッダー・フッター・スタイル・スクリプト
│   ├── pages/
│   │   ├── top/
│   │   ├── news/
│   │   ├── facility/
│   │   ├── basic-research/
│   │   ├── embedded/
│   │   ├── image/
│   │   ├── nlp/
│   │   └── reinforcement/
│   └── ...
├── cms-shells/           ← ArtisCMS3の「埋め込みHTML」欄に貼るための、ページごとの短いiframeシェル（後述8章）
├── .github/workflows/deploy.yml   ← push時にビルドしてGitHub Pagesへ自動デプロイ
├── package.json
├── vite.config.js
└── README.md
```

### 使用してよい技術・ライブラリ

- ビルドツール：Vite
- アニメーション：GSAP（ScrollTrigger含む）、または素のJS（Intersection Observer等）。使用は最小限に絞り、意味のある箇所だけに使う
- スムーススクロール等を入れる場合も、可読性・アクセシビリティを損なわない範囲にとどめる

### リンク・パスのルール

- ページ間の内部リンクは、ドメイン名を含まない**ルート相対パス**で、かつ**`target="_top"`を必ず付与**する（例：`<a href="/faculties/research-center/ai_rd_center/news/" target="_top">`）。理由は8章を参照。相対パス（`../news/`など）は使わない
- 画像は、このフェーズでは公式サイトに実在する画像URLをそのまま絶対URLで参照する（例：`https://www.shonan-it.ac.jp/faculties/media/aicenter001.jpeg`）。独自にアップロードした画像・GitHub経由の画像は、次フェーズ（ガイダンス資料取り込み時）で対応するため、このフェーズでは扱わない

### 文字コード（重要・修正指示）

**現状のページで文字化けが発生している。以下を必ず確認・修正すること。**

- すべてのHTMLファイルで、`<head>`の最初の子要素として`<meta charset="UTF-8">`を宣言する
- すべてのソースファイル（.html/.css/.js/.md）をBOMなしUTF-8で保存する
- Viteのビルド出力や、GitHub Actionsのビルド・デプロイ処理の過程で文字コードが変換されていないか確認する（特に日本語を含むファイル名・テキストがビルド前後で壊れていないかを実際にブラウザで表示して確認すること）
- 8章のiframeシェル（ArtisCMS3側に貼るコード）についても、UTF-8で記述されていることを明記し、CMS側の文字コード設定と衝突する可能性がある場合はその旨をREADMEに注記する

### その他

- ブラウザのlocalStorage/sessionStorageは使用しない
- 実際に送信可能な問い合わせフォームは作らない（公式サイトのお問い合わせページへのリンクに留める）
- アクセシビリティに配慮する（画像には適切なalt属性、コントラスト比の確保など）

## 7. 進め方

1. まず上記の参照元ページをすべて読み込み、取得した情報（見出し・本文・画像URL・リンク先・業績一覧など）を一度整理して提示すること。情報の欠落がないか、こちらで確認できるようにする
2. 現状リポジトリにある文字化けの原因を特定し、修正すること（対応後、修正内容を簡潔に報告すること）
3. 確認後、6章の構成でソースを作成・整理する
4. Vite開発サーバーでのプレビュー、および本番ビルド（`npm run build`）が問題なく通ることを確認する
5. `.github/workflows/deploy.yml`を実装し、`main`ブランチへのpushでGitHub Pagesへ自動デプロイされることを確認する
6. `cms-shells/`配下に、ページごとのiframeシェルコード（8章参照）を用意する
7. `README.md`に以下を必ず記載する：
   - **ローカルでの動作確認方法**（例：`npm install` → `npm run dev` でのプレビュー手順、確認用URL）
   - 本番ビルドの手順
   - GitHub Pagesの公開URL
   - ローカルフォルダ名とArtisCMS3側のページURLの対応表（現時点では空欄でよい。運用者が手動で埋める）
   - cms-shellsの使い方（どのファイルをどのCMSページに貼るか）

## 8. 配信アーキテクチャ（GitHub Pages + iframe）

```
ローカルでsrc/を編集
   ↓ git push
GitHub Actions が自動でビルド → GitHub Pagesへ自動デプロイ
   ↓
ArtisCMS3側の各ページ（最初の1回だけ設定）は、対応するGitHub Pagesの
URLを表示するだけのiframeシェルを持っている
   ↓
以降はpushするだけで、CMS側は一切触らずに全ページが更新される
```

実装時に以下を必ず満たすこと。

1. **`target="_top"`**：iframe内のナビゲーションリンクは、クリック時にiframeを飛び出して本当のCMS上のURL（大学ドメイン）へ遷移するよう、すべて`target="_top"`を付与する
2. **iframeの高さ自動調整**：`shared`のスクリプトに、`ResizeObserver`で本文の高さを検知し`window.parent.postMessage({height: ...}, '*')`で親ウィンドウに伝える処理を実装する。`cms-shells/`側のコードは、そのメッセージを受け取ってiframeの高さを更新する処理を持つこと
3. **フォールバックテキスト（README注記のみでよい）**：iframeの中身は検索エンジンに正しく評価されない可能性があるため、CMS側の通常の編集エリアにも1〜2文程度の実テキストを直接入力しておくことを、README内で運用者への注意事項として明記する（これはClaude Codeの実装対象ではなく、運用者が手動で行う作業）

## 9. 今回のスコープ外（次フェーズ以降で対応）

- PDF/PPTXなどのアップロードファイルからの情報・画像抽出
- GitHub Releaseを使った画像の外部ホスティング（現時点では画像は引き続き公式サイトのURLをそのまま参照する）