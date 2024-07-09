// import { QueryConstraint } from "firebase/firestore";
// import BaseDB from "./base";
// import BaseSubCollectionDB from "./baseSubCollection";

// class BaseDBUtil {
//     static async createDocument(doc: BaseDB): Promise<void> {
//         await doc.addToFirestore();
//     }

//     static async getDocument<T extends BaseDB>(this: { new(): T; dbPath: string }, documentId: string): Promise<T | null> {
//         const data = await BaseDB.getData.call(this, documentId);
//         if (data) {
//             const instance = new this();
//             instance.documentId = documentId;
//             Object.assign(instance, data);
//             return instance;
//         }
//         return null;
//     }

//     static async updateDocument(doc: BaseDB): Promise<void> {
//         await doc.updateInFirestore();
//     }

//     static async deleteDocument<T extends BaseDB>(this: { new(): T; dbPath: string }, documentId: string): Promise<void> {
//         await BaseDB.deleteFromFirestore.call(this, documentId);
//     }

//     // サブコレクションの操作
// }

// export default BaseDBUtil;
