# レポート 021

対象指示: `.orders/order_021.md`（3件の研究デモを対応する研究紹介に配置，1件をAIデモ一覧に追加）

## 概要

3件のGitHubリポジトリの内容を確認し，対応する既存の研究テーマ（研究内容ページ）にデモへのリンクを追加した。また，別途指定された1件を，既存のAIデモ一覧（在学生・高校生向けページ）に追加した。

## 実施内容

### 1. 研究テーマとリポジトリの対応確認

| リポジトリ | 内容（README・説明文で確認） | 対応する既存の研究テーマ |
| :--- | :--- | :--- |
| `koki01150124/bfr-cae` | Bit-Flip Robust Compressive Autoencoder（BFR-CAE）の推論・評価用リポジトリ | `src/data/research/13-bfr-cae.json`（ビット反転の耐性を有するCompressive Autoencoder） |
| `yryo1005/WiT-inference` | 大喜利生成モデル（GUMI_T_ViTFC）の推論用リポジトリ | `src/data/research/04-oogiri-ai.json`（大喜利生成AI） |
| `yryo1005/identity-anonymizer` | GHOST（DeepFake技術）とVAEによる匿名化パイプライン | `src/data/research/05-deepfake-vae.json`（ディープフェイクとVAEを用いたアイデンティティ保持型匿名化） |

いずれも研究内容の説明文（研究者名・手法名）と一致することを確認したうえで対応付けた。

### 2. リンクの動作確認と使い分け

各リポジトリのノートブックの中身を実際に確認し，Colabでそのまま動作するかどうかを見極めたうえでリンク形式を使い分けた。

- **`bfr-cae`・`WiT-inference`**：READMEに「Open in Colab」バッジがあり，ノートブックの先頭セルに`!git clone`・`!pip install`等の環境構築コードが含まれる自己完結型のノートブックであることを確認した。そのため，Google Colabで直接開けるURL（`https://colab.research.google.com/github/<user>/<repo>/blob/<branch>/<path>`）を，各研究テーマJSONの`demo.url`に設定した。
- **`identity-anonymizer`**：READMEにColabバッジが無く，該当ノートブック（`notebooks/03_inference_image.ipynb`）の中身を確認したところ，`REPO_ROOT`・`weights/`・`sample_images/`といったローカルにクローン済みの前提のパスを直接参照しており，`!pip install`等の準備コードが一切無いことを確認した。README記載のとおり，conda環境構築（`mxnet-cu112`等のビルド済みwheel依存）が別途必要であり，Colabのリンクをそのまま開いても動作しない。そのため，この1件だけ「Colabでデモを体験する」という案内はせず，ラベルを「推論ノートブックを見る（GitHub，要ローカル環境構築）」とし，URLも通常のGitHubファイル閲覧ページ（`https://github.com/yryo1005/identity-anonymizer/blob/master/notebooks/03_inference_image.ipynb`）にした。

### 3. 研究内容ページの表示拡張

- 各研究テーマJSONに，新規`demo`フィールド（`{ label, url }`）を追加した。
- `src/shared/script.js`の`renderResearchItems()`を拡張し，`item.demo`が存在する場合に研究カードの説明文の下へリンクを追加表示するようにした（`demo`が無い研究テーマでは何も表示されない，後方互換の実装）。

### 4. AIデモ一覧への追加

`https://github.com/koki01150124/chuunibyou-ai`（中二病文章生成AI）のREADME・ノートブックを確認し，Colabバッジ付きで`!git clone`・依存インストールを含む自己完結型のノートブックであることを確認したうえで，`src/data/demos.js`の`DEMOS`配列に12件目のデモとして追加した（Geminiで生成したデータセットをLSTMで学習しているという，README記載の技術内容をそのまま反映）。

## 検証

- `npm run build`：成功。
- `npm run verify:cms-shells`：cms-shells 7ファイル，README.md記載URL 7件すべてOK。
- Playwrightによる全7ページの自動チェック：画像破損0件，コンソールエラー0件。
- 研究内容ページで，3つの研究テーマ（BFR-CAE，大喜利生成AI，ディープフェイクとVAE）にそれぞれ正しいリンク・ラベルが表示されていることを確認した。
- join・for-highschoolページのAIデモ一覧が12件（既存11件＋中二病文章生成AI）になっていることを確認した。

## 既知の課題・次のステップ

- `identity-anonymizer`のデモを一般公開者がColab等で簡単に体験できるようにしたい場合は，別途，環境構築セルを含む自己完結型のColabノートブックを新規に用意していただく必要がある。
- Colabリンクを実際に開いてノートブックが最後まで正常に動作するかは，この作業環境からは確認できていない（コードの構造から自己完結性を判断したのみ）。
- GitHub認証情報がこの作業環境に保存されていないため，コミット後の`git push`は失敗する見込み。ユーザー側での`git pull`＋手元環境からのpush，または`gh auth login`の設定をお願いしたい。
