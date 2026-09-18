/**
 * AI R&D Centerが作成したオープンキャンパス用AIデモ一覧のデータ．
 * リポジトリ https://github.com/yryo1005/OpenCampus_Demo 内の各Colabノートブックに対応する。
 * join（在学生の方へ）・for-highschool（高校生の方へ）の両ページから，同じデータを共有して参照する。
 * key         : DOM生成時の一意キーに使う識別子。
 * title       : デモ名（日本語）。
 * tag         : 使用している主な技術・モデル名（カード見出し上のタグ表示）。
 * description : デモの内容を1〜2文で説明する文章（各デモの.mdファイルの記載に基づく）。
 * apiKeyNote  : 体験にAPIキー等の準備が必要な場合の注記。不要な場合はnull。
 * links       : { label, url } の配列。1つ目が通常版，2つ目以降はリアルタイム版等のバリエーション。
 */
export const DEMOS = [
  {
    key: "body-landmark",
    title: "全身ランドマーク検出",
    tag: "MediaPipe Pose Landmarker",
    description: "写真やカメラ映像から，全身の骨格（33点）をAIが検出し，関節と骨格線を可視化します．",
    apiKeyNote: null,
    links: [
      { label: "Colabで体験する", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_BodyLandmark.ipynb" },
      { label: "リアルタイム版", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_BodyLandmark_RT.ipynb" },
    ],
  },
  {
    key: "colorize",
    title: "AI着色",
    tag: "DDColor",
    description: "顔写真をモノクロにしてから，AIが自然な色を復元します．",
    apiKeyNote: null,
    links: [
      { label: "Colabで体験する", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_Colorize.ipynb" },
      { label: "リアルタイム版", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_Colorize_RT.ipynb" },
    ],
  },
  {
    key: "depth-anything",
    title: "深度推定",
    tag: "Depth Anything V2",
    description: "1枚の写真から，手前と奥の距離感を色で可視化します．",
    apiKeyNote: null,
    links: [
      { label: "Colabで体験する", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_DepthAnything.ipynb" },
      { label: "リアルタイム版", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_DepthAnything_RT.ipynb" },
    ],
  },
  {
    key: "face-landmark",
    title: "顔ランドマーク検出",
    tag: "MediaPipe Face Landmarker",
    description: "顔写真から，目・鼻・口・輪郭などの特徴点（最大478点）とメッシュを検出・可視化します．",
    apiKeyNote: null,
    links: [
      { label: "Colabで体験する", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_FaceLandmark.ipynb" },
      { label: "リアルタイム版", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_FaceLandmark_RT.ipynb" },
    ],
  },
  {
    key: "face-style",
    title: "顔スタイル変換",
    tag: "AnimeGANv2",
    description: "顔写真を，アニメキャラ風・似顔絵風・絵画風など複数のスタイルに変換します．",
    apiKeyNote: null,
    links: [
      { label: "Colabで体験する", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_FaceStyle.ipynb" },
      { label: "リアルタイム版", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_FaceStyle_RT.ipynb" },
    ],
  },
  {
    key: "facial-expression",
    title: "表情認識",
    tag: "Vision Transformer",
    description: "顔写真から，喜び・悲しみ・怒り・驚きなど7種類の表情をAIが推定します．",
    apiKeyNote: null,
    links: [
      { label: "Colabで体験する", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_FacialExpression.ipynb" },
      { label: "リアルタイム版", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_FacialExpression_RT.ipynb" },
    ],
  },
  {
    key: "handwriting-ocr",
    title: "手書き文字認識",
    tag: "YomiToku",
    description: "手書きの日本語をAIが読み取り，文字データに変換します．",
    apiKeyNote: null,
    links: [
      { label: "Colabで体験する", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_HandwritingOCR.ipynb" },
    ],
  },
  {
    key: "image-gen",
    title: "画像生成",
    tag: "Stable Diffusion v1.5",
    description: "日本語・英語のテキストから，AIが画像を生成します．",
    apiKeyNote: "日本語プロンプトの英語翻訳にGemini APIキーを使用します．体験にはご自身のAPIキーの準備が必要です．",
    links: [
      { label: "Colabで体験する", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_ImageGen.ipynb" },
    ],
  },
  {
    key: "music-gen",
    title: "音楽生成",
    tag: "MusicGen",
    description: "日本語・英語のテキストから，AIが短い音楽クリップを生成します．",
    apiKeyNote: "日本語プロンプトの英語翻訳にGemini APIキーを使用します．体験にはご自身のAPIキーの準備が必要です．",
    links: [
      { label: "Colabで体験する", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_MusicGen.ipynb" },
    ],
  },
  {
    key: "segment-anything",
    title: "セグメンテーション",
    tag: "Segment Anything",
    description: "写真の中の物体を，AIが自動または指定した場所ごとに色分け・切り出しします．",
    apiKeyNote: null,
    links: [
      { label: "Colabで体験する", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_SegmentAnything.ipynb" },
      { label: "リアルタイム版", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_SegmentAnything_RT.ipynb" },
    ],
  },
  {
    key: "speech-recognition",
    title: "音声認識",
    tag: "Whisper",
    description: "話した音声を，AIが文字に変換します．日本語・英語に対応しています．",
    apiKeyNote: null,
    links: [
      { label: "Colabで体験する", url: "https://colab.research.google.com/github/yryo1005/OpenCampus_Demo/blob/main/OC_SpeechRecognition.ipynb" },
    ],
  },
];
