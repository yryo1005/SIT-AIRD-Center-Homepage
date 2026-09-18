# 指示（order_021）

## ユーザー指示（チャットでの原文）

BFR CAEのデモ; https://github.com/koki01150124/bfr-cae
大喜利生成AIのデモ; https://github.com/yryo1005/WiT-inference
DeepFakeを用いた顔変換のデモ; https://github.com/yryo1005/identity-anonymizer

それぞれの研究紹介に対応する形で配置してください

中二病文章生成AI; https://github.com/koki01150124/chuunibyou-ai

デモに追加で配置してください

## 解釈・対応方針

1. 3件のリポジトリの内容をGitHub API・raw.githubusercontent.com経由で確認し，対応する既存の研究テーマを特定した：
   - `bfr-cae` → `src/data/research/13-bfr-cae.json`（ビット反転の耐性を有するCompressive Autoencoder）
   - `WiT-inference` → `src/data/research/04-oogiri-ai.json`（大喜利生成AI）
   - `identity-anonymizer` → `src/data/research/05-deepfake-vae.json`（ディープフェイクとVAEを用いたアイデンティティ保持型匿名化）
2. 各研究テーマのJSONに新規`demo`フィールド（`{ label, url }`）を追加し，研究内容ページの該当カードにデモへのリンクを表示するよう`renderResearchItems()`（`src/shared/script.js`）を拡張する。
3. リンク先の実際のノートブックを確認した結果，`bfr-cae`・`WiT-inference`は「Open in Colab」バッジ付きで，`!git clone`・`!pip install`等の環境構築セルを含む自己完結型のノートブックであることを確認したため，Google Colabで直接開けるURL形式を使用する。一方`identity-anonymizer`の該当ノートブック（`notebooks/03_inference_image.ipynb`）は，READMEにColabバッジが無く，ノートブック自体もconda環境・学習済み重み・サンプル画像が事前に用意されている前提のコードであり，Colabでそのまま開いても動作しない。そのため，この1件のみ「デモを体験する」という表現を避け，「推論ノートブックを見る（GitHub，要ローカル環境構築）」というラベルでGitHubのファイル閲覧リンクを使用する（事実と異なる案内をしないため）。
4. `chuunibyou-ai`（中二病文章生成AI）は，既存のAIデモ一覧（`src/data/demos.js`）に，OpenCampus_Demoの11件と並ぶ12件目として追加する。README・ノートブックを確認し，Colabバッジ付きの自己完結型ノートブックであることを確認したうえで，通常のColabリンク形式で追加する。
