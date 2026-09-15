/**
 * 「学会行脚マップ」で使用する47都道府県のマーカー定義。
 * x, y は，マップのSVG viewBox（0 0 520 760）上でのおおよその位置を表す
 * 模式的な座標であり，実際の行政区画の正確な境界・測地系にもとづくものではない。
 * 各都道府県の相対的な位置関係（北海道が北，沖縄が南西の別枠等）が
 * おおむね分かるように配置している。
 *
 * key: src/assets/images/conference-map/<key>/ フォルダ名と対応する識別子。
 */
export const PREFECTURES = [
  { key: "hokkaido", name: "北海道", x: 345, y: 95 },

  { key: "aomori", name: "青森県", x: 330, y: 178 },
  { key: "iwate", name: "岩手県", x: 362, y: 198 },
  { key: "akita", name: "秋田県", x: 308, y: 202 },
  { key: "miyagi", name: "宮城県", x: 355, y: 222 },
  { key: "yamagata", name: "山形県", x: 318, y: 228 },
  { key: "fukushima", name: "福島県", x: 336, y: 248 },

  { key: "ibaraki", name: "茨城県", x: 372, y: 272 },
  { key: "tochigi", name: "栃木県", x: 350, y: 262 },
  { key: "gunma", name: "群馬県", x: 328, y: 262 },
  { key: "saitama", name: "埼玉県", x: 340, y: 278 },
  { key: "chiba", name: "千葉県", x: 378, y: 293 },
  { key: "tokyo", name: "東京都", x: 350, y: 294 },
  { key: "kanagawa", name: "神奈川県", x: 344, y: 305 },

  { key: "niigata", name: "新潟県", x: 300, y: 240 },
  { key: "toyama", name: "富山県", x: 268, y: 257 },
  { key: "ishikawa", name: "石川県", x: 252, y: 250 },
  { key: "fukui", name: "福井県", x: 253, y: 278 },
  { key: "yamanashi", name: "山梨県", x: 324, y: 292 },
  { key: "nagano", name: "長野県", x: 298, y: 272 },
  { key: "gifu", name: "岐阜県", x: 274, y: 286 },
  { key: "shizuoka", name: "静岡県", x: 318, y: 308 },
  { key: "aichi", name: "愛知県", x: 288, y: 302 },

  { key: "mie", name: "三重県", x: 268, y: 312 },
  { key: "shiga", name: "滋賀県", x: 258, y: 292 },
  { key: "kyoto", name: "京都府", x: 244, y: 291 },
  { key: "osaka", name: "大阪府", x: 244, y: 307 },
  { key: "hyogo", name: "兵庫県", x: 223, y: 296 },
  { key: "nara", name: "奈良県", x: 254, y: 312 },
  { key: "wakayama", name: "和歌山県", x: 244, y: 328 },

  { key: "tottori", name: "鳥取県", x: 203, y: 291 },
  { key: "shimane", name: "島根県", x: 178, y: 286 },
  { key: "okayama", name: "岡山県", x: 209, y: 307 },
  { key: "hiroshima", name: "広島県", x: 183, y: 307 },
  { key: "yamaguchi", name: "山口県", x: 153, y: 312 },

  { key: "tokushima", name: "徳島県", x: 234, y: 332 },
  { key: "kagawa", name: "香川県", x: 219, y: 322 },
  { key: "ehime", name: "愛媛県", x: 189, y: 332 },
  { key: "kochi", name: "高知県", x: 204, y: 347 },

  { key: "fukuoka", name: "福岡県", x: 133, y: 333 },
  { key: "saga", name: "佐賀県", x: 113, y: 342 },
  { key: "nagasaki", name: "長崎県", x: 93, y: 352 },
  { key: "kumamoto", name: "熊本県", x: 123, y: 358 },
  { key: "oita", name: "大分県", x: 149, y: 343 },
  { key: "miyazaki", name: "宮崎県", x: 134, y: 373 },
  { key: "kagoshima", name: "鹿児島県", x: 114, y: 393 },

  { key: "okinawa", name: "沖縄県", x: 108, y: 470 },
];
