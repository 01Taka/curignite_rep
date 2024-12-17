import { Subject } from "../../types/firebase/db/common/commonTypes";

// Subject用のSelectItemリスト
export const subjectSelectItems: { label: string, value: Subject }[] = [
  { label: "数学", value: "mathematics" },
  { label: "化学", value: "chemistry" },
  { label: "物理", value: "physics" },
  { label: "生物", value: "biology" },
  { label: "英語", value: "english" },
  { label: "国語", value: "japaneseLanguage" },
  { label: "古典", value: "classicalLiterature" },
  { label: "漢文", value: "classicalChinese" },
  { label: "社会", value: "socialStudies" },
  { label: "歴史", value: "history" },
  { label: "地理", value: "geography" },
  { label: "情報", value: "computerScience" },
  { label: "未選択", value: "notSelected" },
  { label: "その他", value: "other" },
];
