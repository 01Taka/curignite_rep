import { Subject } from "../../types/firebase/db/common/commonTypes";
import { HexColorCode } from "../../types/util/utilTypes";

export const subjectLabels: { [key in Subject]: string } = {
  mathematics: "数学",
  english: "英語",
  history: "歴史",
  geography: "地理",
  physics: "物理",
  chemistry: "化学",
  biology: "生物",
  computerScience: "情報",
  socialStudies: "社会",
  japaneseLanguage: "国語",
  classicalLiterature: "古文",
  classicalChinese: "漢文",
  other: "その他",
  notSelected: "未選択",
};

export const subjectColors: Record<Subject, HexColorCode> = {
  mathematics: "#6084F7", // ブライトブルー
  english: "#FF5479", // ブライトレッド
  history: "#D2691E", // チョコレートブラウン
  geography: "#32CD32", // ライムグリーン
  physics: "#28E0B5", // ティール
  chemistry: "#FFA500", // オレンジ
  biology: "#21EB02", // フォレストグリーン
  computerScience: "#C634EB", // ラベンダー
  socialStudies: "#FFD700", // ゴールド
  japaneseLanguage: "#FA9716", // トマト
  classicalLiterature: "#FA3CBB", // ホットピンク
  classicalChinese: "#EB3440", // ファイヤーエンジンレッド
  other: "#A9A9A9", // ダークグレー
  notSelected: "#C9C9C9", // ホワイトグレー
};

export const subjectColorsLight: Record<Subject, HexColorCode> = {
  mathematics: "#A3B8F9", // ブライトブルー (薄く)
  english: "#FF85A3", // ブライトレッド (薄く)
  history: "#E18B4D", // チョコレートブラウン (薄く)
  geography: "#7BEB7B", // ライムグリーン (薄く)
  physics: "#7AE8D3", // ティール (薄く)
  chemistry: "#FFB84D", // オレンジ (薄く)
  biology: "#A7F8A5", // フォレストグリーン (薄く)
  computerScience: "#D89CFE", // ラベンダー (薄く)
  socialStudies: "#FFEB85", // ゴールド (薄く)
  japaneseLanguage: "#FDB77F", // トマト (薄く)
  classicalLiterature: "#FDA6D6", // ホットピンク (薄く)
  classicalChinese: "#F5828D", // ファイヤーエンジンレッド (薄く)
  other: "#D0D0D0", // ダークグレー (薄く)
  notSelected: "#DADADA", // ホワイトグレー (薄く)
};
