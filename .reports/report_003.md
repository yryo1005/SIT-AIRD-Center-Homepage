# report_003：GitHub Pages公開URLの修正／画像表示の修正 実施レポート

対応する指示書：`.orders/order_003.md`

## 1. 実施内容の概要

GitHub Pages有効化後の実地検証で報告された2点の不具合に対応した。

1. `cms-shells/`配下のiframe `src`のうち、リポジトリ名パスが抜けているものがあり404になっていた問題
2. 公開ページ上で画像が表示されていない問題

## 2. 指示1：URLの修正（リポジトリ名パスの補完）

### 現状確認

作業開始時点で`cms-shells/*.html`（8ファイル）を確認したところ、いずれも`https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/<ページ名>/index.html`という、リポジトリ名を含む正しいURLが記述されていた。これは、report_002作成後にリポジトリへpushされた最新のコミット（`a59d567`）の内容と一致しており、指示書で報告された「ニュースページのURLでリポジトリ名が抜けていた」状態は、この修正が反映される前の一時的な状態だったと考えられる。

### 保守性向上のための恒久対応

現状のURLは正しかったが、指示書の指摘どおり「ベースパスをファイルごとに個別にハードコードする」構成は、今後同様の食い違いを再発させるリスクがあるため、以下の恒久対応を行った。

- `site.config.js`を新設し、GitHub PagesのベースURL（`BASE_PATH`・`SITE_BASE_URL`）とページ一覧（`PAGES`）を一元管理する単一の情報源とした。
- `vite.config.js`は`site.config.js`から`BASE_PATH`・`PAGES`を直接importし、`base`設定とビルドエントリを構築するよう変更した（従来はvite.config.js内にリポジトリ名・8ページ分のパスを直接記述していた）。
- `scripts/generate-cms-shells.js`を新設し、`site.config.js`から`cms-shells/*.html`を生成するようにした。生成ファイルの先頭コメントに「手動編集せず、本スクリプトを再実行すること」を明記した。
- `scripts/verify-cms-shells.js`を新設し、次の3点を検証できるようにした。
  1. `cms-shells/*.html`が`site.config.js`から生成される内容と一致しているか（手作業でのdrift検出）
  2. README.md記載の公開URL例が`site.config.js`の算出結果と一致しているか
  3. （`--live`指定時）各ページの公開URLが実際にHTTP 200を返すか
- `package.json`に`generate:cms-shells`・`verify:cms-shells`・`verify:cms-shells:live`のnpm scriptsを追加した。

### 全8ページの疎通確認結果

`npm run verify:cms-shells:live`を実行し、以下のとおり全8ページがHTTP 200であることを確認した（1ページのみの確認で終わらせず、全件確認済み）。

```
=== GitHub Pages公開URLの疎通検証（--live） ===
✓ top: 200 https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/top/index.html
✓ news: 200 https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/news/index.html
✓ facility: 200 https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/facility/index.html
✓ basic-research: 200 https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/basic-research/index.html
✓ embedded: 200 https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/embedded/index.html
✓ image: 200 https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/image/index.html
✓ nlp: 200 https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/nlp/index.html
✓ reinforcement: 200 https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/reinforcement/index.html

すべての検証に成功しました。
```

`vite.config.js`の`base`設定・README.md内の公開URLの例・`cms-shells/`のURLの3箇所についても、いずれも`site.config.js`から導出される構成に統一したため、構造的に食い違いが起こらないことを確認した。

## 3. 指示2：画像が表示されない問題の調査・修正

### 手順1：HTML実装の確認

全8ページのソースを確認し、`<img src="...">`の実装が想定どおり存在することを確認した（合計22件の`<img>`タグ、いずれも公式サイトの画像URLを絶対URLで指定、alt属性も設定済み）。実装漏れは無かった。

### 手順2：実際のリクエスト状況の確認

GitHub Pages上の実ページ（`https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/top/index.html`ほか）を、Playwright（Chromium）で複数回開き、Networkログ・Consoleログを確認した。

- ほとんどの試行では、全画像がHTTP 200で正常に読み込まれ、`naturalWidth`も正しい値（読み込み成功の証跡）を示した。
- 1回のみ、全5枚の画像が同時に`net::ERR_CONNECTION_CLOSED`で失敗する事象が発生した。直後に同じページを再読み込みしたところ再現しなかった。
- コンソールエラーは全試行を通じて0件だった（403やCORSエラーを含め、エラーメッセージは一度も観測されなかった）。

### 手順3：ホットリンク対策（Refererチェック）の可能性の検証

同一の画像URLに対して、Refererヘッダーを「なし」「GitHub PagesのURL」「公式サイト自身のURL」の3パターンでcurlリクエストを送信し、いずれも200が返ることを確認した。また、並行して複数枚の画像に同時アクセスするテストも行ったが、いずれも200で問題なく応答した。403等の明示的な拒否は一度も観測されなかった。

### 判断と対応

以上の検証から、Refererチェックによる恒常的な画像拒否が起きているという明確な証拠は得られなかった。観測された1回の接続断は、一時的なネットワークの不安定性による可能性が高いと判断した。

ただし、指示書が明示的に推奨している予防策であり、実施しても副作用がないことから、全`<img>`タグ（22件）に`referrerpolicy="no-referrer"`属性を追加した。これにより、別オリジン（GitHub Pages）から画像を読み込む際にRefererヘッダーが送信されなくなり、仮に公式サイト側でReferer起因のブロックが行われていた場合でも影響を受けなくなる。

推測にもとづく断定的な原因確定（例：「サーバー側の恒常的なホットリンク対策が原因である」と決めつけること）は行っておらず、指示書でスコープ外とされているGitHub Releaseへの画像移設等の対応も行っていない。

### 修正後の確認結果

`referrerpolicy="no-referrer"`追加後、`npm run build`でビルドし、`npm run preview`のローカルサーバー上でPlaywrightを用いて全画像の`referrerPolicy`プロパティが`"no-referrer"`になっていること、および画像が正常に表示される（`naturalWidth > 0`）ことを確認した。

```
top: total=5 broken=0 referrerPolicy(sample)=no-referrer
facility: total=8 broken=0 referrerPolicy(sample)=no-referrer
basic-research: total=4 broken=0 referrerPolicy(sample)=no-referrer
embedded: total=2 broken=0 referrerPolicy(sample)=no-referrer
image: total=2 broken=0 referrerPolicy(sample)=no-referrer
nlp: total=1 broken=0 referrerPolicy(sample)=no-referrer
```

news・reinforcementページには元々`<img>`タグが存在しないため対象外である。

## 4. 未解決の論点・次に検討すべき作業

- 画像表示に関する1回限りの接続断が再発するかどうかは、本セッション内では確定的に判断できていない。今後、実際のCMS埋め込み環境（大学ドメインのページ内のiframe）でも表示が安定しているかを継続的に確認する必要がある。再発する場合は、公式サイト側のサーバーログ等、こちらから確認できない情報が必要になる可能性が高い。
- `site.config.js`による一元管理化に伴い、`vite.config.js`・`cms-shells/`・README.mdの3者は構造的に一致する状態を維持できるようになったが、`README.md`内の「ArtisCMS3側の公開URL」列（運用者記入欄）は引き続き手動更新が必要である。
- 本レポート作成時点で、修正内容はローカルにコミット済みだが、GitHubへのpushはこの環境の認証情報の有無に依存する（詳細はチャット側の報告を参照）。

## 5. ローカルでの検証コマンド

```bash
npm run generate:cms-shells       # site.config.jsからcms-shells/*.htmlを再生成
npm run verify:cms-shells         # cms-shells/README.mdの整合性検証（ネットワークなし）
npm run verify:cms-shells:live    # 上記に加え、GitHub Pages公開URLの疎通確認（ネットワークあり）
npm run build && npm run preview  # ローカルでの最終表示確認
```
