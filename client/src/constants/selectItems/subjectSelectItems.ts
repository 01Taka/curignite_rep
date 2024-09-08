import { SelectItem } from "../../types/util/componentsTypes";
import { Subject } from "../../types/firebase/db/common/commonTypes";

// Subject用のSelectItemリスト
export const subjectSelectItems: SelectItem<Subject>[] = [
  { label: "数学", value: Subject.Math },
  { label: "化学", value: Subject.Chemistry },
  { label: "物理", value: Subject.Physics },
  { label: "生物", value: Subject.Biology },
  { label: "英語", value: Subject.English },
  { label: "国語", value: Subject.JapaneseLanguage },
  { label: "古典", value: Subject.ClassicalLiterature },
  { label: "漢文", value: Subject.ClassicalChinese },
  { label: "社会", value: Subject.SocialStudies },
  { label: "歴史", value: Subject.History },
  { label: "地理", value: Subject.Geography },
  { label: "情報", value: Subject.ComputerScience },
  { label: "未選択", value: Subject.NotSelected },
  { label: "その他", value: Subject.Other },
];
