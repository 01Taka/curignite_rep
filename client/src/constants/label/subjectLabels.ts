import { Subject } from "../../types/firebase/db/common/commonTypes";
import { HexColorCode } from "../../types/util/utilTypes";

export const subjectLabels: { [key in Subject]: string } = {
  [Subject.Math]: "数学",
  [Subject.English]: "英語",
  [Subject.History]: "歴史",
  [Subject.Geography]: "地理",
  [Subject.Physics]: "物理",
  [Subject.Chemistry]: "化学",
  [Subject.Biology]: "生物",
  [Subject.ComputerScience]: "情報",
  [Subject.SocialStudies]: "社会",
  [Subject.JapaneseLanguage]: "国語",
  [Subject.ClassicalLiterature]: "古文",
  [Subject.ClassicalChinese]: "漢文",
  [Subject.Other]: "その他",
  [Subject.NotSelected]: "未選択",
}

export const subjectColors: Record<Subject, HexColorCode> = {
  [Subject.Math]: "#6084F7", // ブライトブルー
  [Subject.English]: "#FF5479", // ブライトレッド
  [Subject.History]: "#D2691E", // チョコレートブラウン
  [Subject.Geography]: "#32CD32", // ライムグリーン
  [Subject.Physics]: "#28E0B5", // ティール
  [Subject.Chemistry]: "#FFA500", // オレンジ
  [Subject.Biology]: "#21EB02", // フォレストグリーン
  [Subject.ComputerScience]: "#C634EB", // ラベンダー
  [Subject.SocialStudies]: "#FFD700", // ゴールド
  [Subject.JapaneseLanguage]: "#FA9716", // トマト
  [Subject.ClassicalLiterature]: "#FA3CBB", // ホットピンク
  [Subject.ClassicalChinese]: "#EB3440", // ファイヤーエンジンレッド
  [Subject.Other]: "#A9A9A9", // ダークグレー
  [Subject.NotSelected]: "#C9C9C9", // ホワイトグレー
};
