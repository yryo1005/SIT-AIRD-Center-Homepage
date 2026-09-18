# 指示（order_020）

## ユーザー指示（チャットでの原文）

https://github.com/yryo1005/OpenCampus_Demo
上記はAIセンターで作成したAIのデモです
各デモを説明し，デモを体験するipynbのリンクを追加してください

追加するページは在学生，高校生向けページとします

## 解釈・対応方針

1. `https://github.com/yryo1005/OpenCampus_Demo`のリポジトリ内容をGitHub API・raw.githubusercontent.com経由で確認し，11件のAIデモ（各`.ipynb`＋説明用`.md`が対となっている）を特定した：全身ランドマーク検出，AI着色，深度推定，顔ランドマーク検出，顔スタイル変換，表情認識，手書き文字認識，画像生成，音楽生成，セグメンテーション，音声認識。うち7件はリアルタイム版（`_RT.ipynb`）も用意されている。
2. 各デモの説明文は，対応する`OC_XXX.md`ファイルの記載内容（主な技術，デモの概要）に基づいて作成し，新たな推測は加えない。画像生成・音楽生成の2件は，Gemini APIキーが必要である旨を明記する（`OC_ImageGen.md`／`OC_MusicGen.md`に記載の事実）。
3. 「デモを体験するipynbのリンク」は，GitHub上のファイル閲覧リンクではなく，Google Colabで直接開ける`https://colab.research.google.com/github/<user>/<repo>/blob/<branch>/<path>`形式のURLとする（「体験する」という目的に最も適した形式のため）。
4. データファイル化（`src/data/demos.js`）し，joinページ・for-highschoolページの両方から同じデータを共有して参照する（既存の学生の声・研究内容・業績一覧と同じ設計パターン）。
5. 両ページに新規セクション「AIデモを体験しよう」を追加し，各デモをカード形式で一覧表示する。セクション番号・目次への反映は既存の仕組み（自動生成）に従う。
