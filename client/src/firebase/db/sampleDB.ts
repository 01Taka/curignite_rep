// class MySamplesDB extends BaseDB<MySampleData> {
//     constructor(firestore: Firestore) {
//         super(firestore, `mySamples`);
//     }

//     /**
//      * 新しいマイを作成
//      * @param createdById マイの作成者のUID
//      * @returns 新しく作成されたマイのドキュメントリファレンス
//      */
//     async createMySample(
//         createdById: string,
//     ): Promise<DocumentReference<DocumentData>> {
//         try {
//             const data: MySampleData = {
//               ...getInitialBaseDocumentData(createdById),
//             };
//             return this.create(data);
//         } catch (error) {
//             console.error("Error creating mySample: ", error);
//             throw new Error("Failed to create mySample"); // エラー発生時にカスタムエラーメッセージをスロー
//         }
//     }

//     /**
//      * マイデータを取得
//      * @param mySampleId マイID
//      * @returns マイデータ
//      */
//     async getMySample(mySampleId: string): Promise<MySampleData | null> {
//         try {
//             return await this.read(mySampleId);
//         } catch (error) {
//             console.error("Failed to get mySample data: ", error);
//             return null;
//         }
//     }

//     /**
//      * マイデータを更新
//      * @param mySampleId マイID
//      * @param data 更新するデータ
//      */
//     async updateMySample(mySampleId: string, data: Partial<MySampleData>): Promise<void> {
//         try {
//             await this.update(mySampleId, data);
//         } catch (error) {
//             console.error("Failed to update mySample data: ", error);
//             throw new Error("Failed to update mySample data");
//         }
//     }

//     /**
//      * マイデータを削除
//      * @param mySampleId マイID
//      */
//     async deleteMySample(mySampleId: string): Promise<void> {
//         try {
//             await this.softDelete(mySampleId);
//         } catch (error) {
//             console.error("Failed to delete mySample data: ", error);
//             throw new Error("Failed to delete mySample data");
//         }
//     }
// }

// export default MySamplesDB;

export {};