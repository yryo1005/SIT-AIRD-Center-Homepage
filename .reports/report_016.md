# レポート 016

対象指示: `.orders/order_016.md`（在学生向けページ・高校生向けページの新設，学生の声のデータファイル化）

## 概要

在学生（入局希望者）向けページ`src/pages/join/`と，高校生・保護者向けページ`src/pages/for-highschool/`を新設した。あわせて，これまで研究内容ページにハードコードされていた学生の声のうち2件（井上來彌・渡邉光喜）を`src/data/students/`のJSONデータへ移行し，研究内容ページ・在学生向けページの両方から共通参照できるようにした。実装前に構成案を提示してユーザーの確認を取り，確認時に指摘された2点（ヘッダーナビの実際の項目数，「出身校」情報の出典）を再検証したうえで実装に着手した。

## 実装前の確認事項（ユーザー指摘への対応）

1. **ヘッダーナビの項目数**：構成案提示時に誤って「現在8項目→10項目」と記載していたが，`grep`で実際のナビ（`main-nav`内の`<a>`要素）を再確認したところ，現在は5項目（トップ／ニュース／施設／研究内容／学会マップ）であり，正しくは「5→7項目」であった。この訂正を踏まえ，特別なグループ化・折りたたみ処理は不要と判断し，既存の`flex-wrap`のみで7項目を収める方針とした。
2. **`students.json`の「出身校」情報の出典**：`references/AI専攻印刷用2026.pdf`（gitignore対象，ローカルに保持）を再読し，井上來彌氏「神奈川県立大磯高等学校出身」，渡邉光喜氏「日本航空高等学校出身」の両方が元資料に明記されていることを確認した。未確認の個人情報ではないため，`meta`フィールドにそのまま残した。

## 実施内容

### 1. 学生の声のデータファイル化（`src/data/students/`）

- `01-inoue-kurumi.json`・`02-watanabe-kouki.json`を作成し，`name`／`meta`／`researchTitle`／`researchSummary`／`quote`／`image`の構造に統一した。
- `src/shared/script.js`に`studentModules`／`studentsData`（`import.meta.glob("../data/students/*.json", { eager: true })`，ファイル名順ソート）と`renderStudentVoices()`を追加し，`.voice-list[data-source="students-json"]`に該当する全要素（`querySelectorAll`で複数ページ分に対応）へ同一データを描画するようにした。`DOMContentLoaded`内で`renderResearchItems()`の直後に呼び出すよう登録した。
- `basic-research/index.html`の既存6件の学生の声カードのうち，データ化対象の2件（井上・渡邉）をハードコードHTMLから削除し，`<div class="card-grid voice-list" data-source="students-json">`のマウントポイントに置き換えた。残る4件（渡部朔冶・石川悠樹・濵田聖・山富龍）は今回の指示範囲外のためハードコードのまま維持した。
- **新しい学生の声を推測で追加することはしていない**。既存2名分のみをデータ化した。

### 2. `src/pages/join/index.html`（在学生の方へ）の新設

構成：ヒーロー／AI R&D Centerとは／活動のサイクル／対外的な活動・メンバー同士の交流／参加方法／よくある質問／先輩の声／お問い合わせ，の8セクション。

- 「活動のサイクル」「対外的な活動」「メンバー同士の交流」は，トップページの「参加案内」に既にあった内容を移設・拡充した。
- 「参加方法」は，具体的な申込手続きを断定的に記載せず，指導教員への相談を促す記述にとどめた。
- 「よくある質問」は，事実で裏付けられる2件（未経験可否＝井上さんの事例，学年不問＝在籍学年の統計）のみを掲載し，出典のない質問項目は作成していない。
- 「先輩の声」は`data-source="students-json"`のマウントポイントとし，研究内容ページと同一データを参照する。
- 「お問い合わせ」は指導教員への案内のみとし，送信可能な問い合わせフォームは設置していない。

### 3. `src/pages/for-highschool/index.html`（高校生の方へ）の新設

構成：ヒーロー／AI R&D Centerってどんなところ？／活動実績ハイライト／活動スペースの雰囲気（施設）／2027年，人工知能専攻が始まります／先輩の声／進学を考えている方へ，の7セクション。

- 平易な言葉づかいを心がけ，専門用語を避けた説明にした。
- 「活動実績ハイライト」は，既存の実績統計（対外活動49件，東京ゲームショウ出展，ACM ICPC参加，在籍約40名）から抜粋した。
- 「活動スペースの雰囲気」は，施設ページの既存写真を再利用し，施設ページへのリンクを設置した。
- 「2027年，人工知能専攻が始まります」は，トップページに既にある記述（2027年4月，情報学部情報学科に人工知能専攻・定員45名を新設予定）をそのまま用い，新たな推測は追加していない。
- 「進学を考えている方へ」は，大学公式サイトのオープンキャンパスページ（`https://www.shonan-it.ac.jp/open-campus/`）と入試情報ページ（`https://www.shonan-it.ac.jp/examination/`）への外部リンクのみとし，日程・出願条件等の具体的な数値はこのページ上に記載していない。

### 4. サイト全体の更新

- `site.config.js`のPAGESに`join`・`for-highschool`を追加した（`cmsPath`はそれぞれ`/faculties/research-center/ai_rd_center/join/`・`/faculties/research-center/ai_rd_center/for-highschool/`）。
- 全7ページ（既存5ページ＋新設2ページ）のヘッダーナビに，新設2ページへのリンクを追加した。各ページ自身へのリンクには`aria-current="page"`を付与した。
- トップページの「参加案内」セクションを，詳細内容の重複記載をやめ，要約の`notice-panel`＋新設2ページへのリンクカード2枚（`.card-grid`）に簡略化した。
- `npm run generate:cms-shells`を実行し，`cms-shells/join.html`・`cms-shells/for-highschool.html`を生成した。
- `README.md`の以下の箇所を7ページ分に更新した：ローカル開発URL一覧，GitHub Pages公開URL一覧，cms-shellsのファイル対応表，ローカルフォルダ名とArtisCMS3側ページURLの対応表。加えて，新設セクション「学生の声を追加・編集する方法」を追加し，`meta`フィールドには本人確認・元資料で確認できた情報のみを記載する旨を明記した。

## 検証

- `npm run build`：成功（7ページ分のHTMLがビルドされ，画像は全てハッシュ付きアセットとして出力されることを確認）。
- `npm run generate:cms-shells`：7ファイルすべて生成成功。
- `npm run verify:cms-shells`：cms-shells 7ファイルの整合性，README.md記載URL 7件すべてOK。
- Playwrightによる全7ページ（top／news／facility／basic-research／conference-map／join／for-highschool）の自動チェック：画像破損0件，コンソールエラー0件。
- `basic-research`ページの学生の声セクションが計6件（静的4件＋データ駆動2件）表示され，内容・画像とも正しいことを確認した。

## 既知の課題・次のステップ

- `basic-research`ページに残る4件のハードコード学生の声（渡部朔冶・石川悠樹・濵田聖・山富龍）は，今回の指示範囲外のため未移行のままである。将来的に全件をデータファイル化したい場合は別途指示いただきたい。
- GitHub認証情報がこの作業環境に保存されていないため，コミット後の`git push`は失敗する見込み。ユーザー側での`git pull`＋手元環境からのpush，または`gh auth login`の設定をお願いしたい。
