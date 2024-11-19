import { DocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import { BaseDocumentRead } from "../../../types/firebase/db/baseTypes";
import { convertTimestampsToNumbers } from "../../../functions/db/dataFormatUtils";

/**
 * ドキュメントスナップショットからデータを抽出して整形するユーティリティ関数
 * @param docSnapshot ドキュメントスナップショット
 * @returns 整形されたデータ
 */
export const parseDocumentSnapshot = <Read extends BaseDocumentRead>(
  docSnapshot: DocumentSnapshot
): Read | null => {
  if (!docSnapshot.exists()) return null;

  const data = docSnapshot.data() as Read;

  if (!data.isActive) return null; // 論理削除されたデータは無効

  const convertedData = convertTimestampsToNumbers(data) as Read;

  // 基本プロパティの設定
  convertedData.docId = docSnapshot.id;
  convertedData.path = docSnapshot.ref.path; // 修正: フルパスに変更
  convertedData.parentId = docSnapshot.ref.parent.parent?.id ?? '';

  return convertedData;
}

/**
 * クエリスナップショットをパースする関数
 * @param querySnapshot クエリスナップショット
 * @returns 整形されたデータの配列
 */
export const parseQuerySnapshot = <Read extends BaseDocumentRead>(
  querySnapshot: QuerySnapshot
): Read[]  => {
  return querySnapshot.docs
    .map((doc) => parseDocumentSnapshot(doc)) // 各ドキュメントをパース
    .filter((doc): doc is Read => doc !== null); // null を除外
}
