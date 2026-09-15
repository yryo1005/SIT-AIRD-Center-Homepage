# report_007：コンテンツのデータファイル駆動化（第一弾：ニュース） 実施レポート

対応する指示書：`.orders/order_007.md`

## 1. 実施内容の概要

ニュースの内容をHTMLに直接書く方式から、`src/data/news.json`という1つのJSONファイルを編集するだけで更新できる方式へ変更した。実装前に`news.json`のデータ構造案を提示し、ユーザーの承認を得たうえで実装した。

## 2. データ構造（実装したもの）

`src/data/news.json`は、以下の5フィールドを持つオブジェクトの配列である。

| フィールド | 型 | 必須 | 説明 |
| :--- | :--- | :--- | :--- |
| `date` | 文字列（`YYYY-MM-DD`） | 必須 | `<time datetime>`と表示順の並べ替えに使用 |
| `title` | 文字列 | 必須 | 見出し |
| `summary` | 文字列 | 必須 | 本文 |
| `image` | 文字列（URL）または`null` | 任意 | 画像がない記事は`null` |
| `imageAlt` | 文字列 | `image`がある場合に推奨 | 代替テキスト |

既存の21件のニュース項目を、1件も欠落・改変させずにこの構造へ移行した（日付・タイトル・本文・画像URLをすべて突き合わせて確認済み）。

## 3. 実装内容

### 3.1 データと表示の分離

- `src/data/news.json`を新設し、コンテンツをここに集約した。
- `src/shared/script.js`に`import newsData from "../data/news.json"`を追加した。Viteの標準機能でJSONを直接importできるため、追加のライブラリは導入していない。
- 以下の関数を追加した。
  - `escapeHtml(value)`：`&`・`<`・`>`等のHTML特殊文字をエスケープする。`title`/`summary`を`innerHTML`で挿入するため、本文に記号が含まれてもレイアウトが壊れないようにする安全対策。
  - `sortNewsByDateDesc(items)`：`date`の降順に並べ替える。**`news.json`内の記載順に関わらず常に日付順で表示される**ため、更新時に挿入位置を気にする必要がない。
  - `formatNewsDateLabel(isoDate)`：`"2026-06-16"`のような`date`を、既存の表示形式`"2026.06.16"`に変換する。
  - `renderNewsTicker()`：トップページの`.news-ticker-track[data-source="news-json"]`へ、日付が新しい上位5件を描画する。
  - `renderNewsList()`：ニュースページの`.news-list[data-source="news-json"]`へ全件を描画し、`#news-count`要素があれば件数も自動反映する。
- `src/pages/top/index.html`・`src/pages/news/index.html`から、ハードコードされていたニュース行・ティッカー項目をすべて削除し、`data-source="news-json"`を付けた空のマウント先要素に置き換えた。

### 3.2 README.mdへの更新手順の追加

「ニュースを追加・編集する方法（HTML/JavaScriptの知識がなくてもできます）」という節を新設し、以下を記載した。

- 編集対象ファイル（`src/data/news.json`）
- 各フィールドの意味を表形式で説明
- 1件追加する際にそのままコピペできる具体例
- JSON構文の初歩的な注意点（`,`の付け忘れ・付けすぎ）とJSON検証サイトの案内
- 保存後、コミット・pushすればGitHub Actionsで自動デプロイされる旨

## 4. 動作確認

### 4.1 ビルド確認

`npm run build`が問題なく完了し、`news.json`の内容がバンドルされた`script.js`（2.48kB→8.03kB）が生成されることを確認した。

### 4.2 表示確認（Playwright）

`npm run preview`のローカルサーバー上で以下を確認した。

- ニュースページ：21件すべてが表示され、`#news-count`が「21」と表示されること
- トップページ：ティッカーに日付が新しい上位5件が表示され、シームレスループ用に複製されていること
- 全ページでコンソールエラーが0件であること、画像が破損なく表示されること（他ページへの影響がないことの回帰確認を含む）

### 4.3 自己検証（テスト追加・削除）

指示書の要求どおり、README.mdに記載した手順をそのままなぞって実際にテストを行った。

1. `news.json`の配列の先頭に、日付を最新（2026-09-15）にしたテスト項目（画像なし）を追加
2. `npm run build`が通ることを確認
3. ニュースページで該当項目が**先頭**に表示され、件数表示が「22」に自動更新されること、トップページのティッカーにも反映されることをPlaywrightで確認
4. テスト項目を削除し、`npm run build`後に件数が「21」に戻ることを確認

README.mdの手順どおりに作業して迷う点がなかったため、手順の過不足は無いと判断した。

## 5. 将来の拡張に向けたデータ構造案（設計のみ・未実装）

指示書のとおり、実装・データ投入は行わず、設計案のみ提示する。

### 5.1 `src/data/students.json`（学生紹介・コラム）

```json
{
  "id": "student-01",
  "name": "渡部 朔冶",
  "grade": "工学部情報工学科4年",
  "year": "令和5年度",
  "researchTheme": "Gated Recurrent Unitを用いた将棋の棋譜分類手法",
  "comment": "将棋に関する研究で楽しく実験や考察を進めることができました。",
  "photo": "https://www.shonan-it.ac.jp/faculties/media/watanabe_shogi.png",
  "photoAlt": "渡部朔冶さんの研究に関する画像",
  "publications": [
    "渡部朔冶，佐々木智志，\"Gated Recurrent Unitを用いた将棋の棋譜分類手法\"，電子情報通信学会，2023年NOLTAソサイエティ大会，NLS-36(2023)"
  ]
}
```

既存の基礎研究ページ「学生の声」（`.voice-card`）が持つ情報（氏名・学年・年度・研究テーマ・コメント・写真・研究履歴）とそのまま対応する構造である。

### 5.2 `src/data/theses.json`（過去の卒研テーマ・予稿一覧）

```json
{
  "id": "thesis-001",
  "year": "2022",
  "authors": "Shahrzad Mahboubi, Ryo Yamatomi, and Hiroshi Ninomiya",
  "title": "On the Study of Memory-Less quasi-Newton Method with Momentum Term for Neural Network Training",
  "category": "journal",
  "citation": "Nonlinear Theory and Its Applications, IEICE, Vol.13, no.2, pp.271-276, (2022)"
}
```

`category`は`"journal"`（学術論文誌）・`"international"`（査読あり国際会議）・`"domestic"`（査読無し国内学会）の3種とし、現行の基礎研究ページのアコーディオン分類とそのまま対応させる。将来的には、基礎研究ページの業績一覧（現在はHTMLに直接記述している42件）も、このデータ構造への移行を検討できる。

いずれも、ニュースと同様に「配列のどこに追加してもよく、表示側で自動的に並べ替え・グルーピングする」設計方針を踏襲する想定である。

## 6. 未解決の論点・次に検討すべき作業

- 学生紹介（`students.json`）・卒研一覧（`theses.json`）の実装・ページ化・データ投入は、次回の指示を待って着手する。
- 基礎研究ページの業績一覧（42件）は今回データファイル化していない。将来`theses.json`を導入する際、この42件をどう移行するか（全面移行か、新規分のみデータファイル管理にするか）は改めて判断が必要である。
- ニュース画像は引き続き公式サイトの絶対URLを参照する方式のままである（次フェーズでのGitHub Release等への切り替えを検討する場合、`news.json`の`image`フィールドの値を差し替えるだけで対応できる）。

## 7. ローカルでの確認コマンド

```bash
npm run build && npm run preview   # ビルド・表示確認
# src/data/news.json を編集後、上記を再実行すれば変更が反映される
```
