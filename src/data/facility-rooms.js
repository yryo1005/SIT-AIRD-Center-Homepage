/**
 * 施設ページで縦に並べる各部屋の定義。
 * key: src/assets/images/facility/<key>/ フォルダ名と対応する識別子。
 *      このフォルダに写真を追加するだけで，該当する部屋の表示に反映される
 *      （学会行脚マップの都道府県フォルダと同じ仕組み）。
 * name: 部屋名（日本語）。
 * caption: 部屋名の英語ラベル（見出し上のスモールキャップス表示に使用）。
 * description: 部屋の説明文。
 */
export const FACILITY_ROOMS = [
  {
    key: "entrance",
    name: "入口・エントランス",
    caption: "Entrance",
    description:
      "1号館1階、入って正面がAI R&D Centerの入口です。展示ポスターや活動紹介が飾られたショーウィンドウのほか、数学・プログラミング・AIに関わる技術書や論文誌が充実した本棚があり、日々更新されています。センター内には警備ロボット「ポッホ」と「ベッペ」もいます。",
  },
  {
    key: "large-meeting-room",
    name: "大会議室",
    caption: "Room 01",
    description: "週に1度のメンバーの活動報告や、Sub Projectと呼ばれる授業、ゼミ、各自の作業を行なっています。",
  },
  {
    key: "small-meeting-room",
    name: "小会議室",
    caption: "Room 02",
    description: "ゼミや学生同士の会議、先生同士の会議を行っています。",
  },
  {
    key: "exhibition-room",
    name: "展示室",
    caption: "Room 03",
    description: "ゼミや活動報告、広いスペースを必要とする実験を行っています。",
  },
  {
    key: "yogibo-zone",
    name: "ヨギボーゾーン",
    caption: "Room 04",
    description: "ゼミや活動報告を行っています。また、ヨギボーに座って個人作業をしているメンバーもいます。",
  },
];
