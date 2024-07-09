// import { Timestamp, DocumentData, QueryConstraint } from "firebase/firestore"; 
// import BaseDB from "../../base";

// export class UserDB extends BaseDB{
//     uid: string;
//     studentInfo: DocumentData;
//     createdAt: Timestamp; // FirestoreのTimestamp型を使用する
//     updatedAt: Timestamp;
//     documentId: string;

//     constructor(uid: string, studentInfo: DocumentData, createdAt: Timestamp = Timestamp.now(), updatedAt: Timestamp = Timestamp.now(), documentId: string = "") {
//         super();
//         this.uid = uid;
//         this.studentInfo = studentInfo;
//         this.createdAt = createdAt; // FirestoreのTimestamp型に変換
//         this.updatedAt = updatedAt;
//         this.documentId = documentId;
//     }

//     getPath(): string {
//         return 'users'
//     }

//     // Firestoreのデータ形式に変換するメソッド
//     toFirestore(): DocumentData {
//         return {
//             uid: this.uid,
//             studentInfo: this.studentInfo,
//             createdAt: this.createdAt,
//             updatedAt: this.updatedAt,
//         };
//     }

//     // FirestoreからのデータをUserクラスに変換するメソッド
//     static fromFirestore(data: DocumentData, documentId: string): UserDB {
//         const { uid, studentInfo, createdAt, updatedAt } = data;
//         return new UserDB(uid, studentInfo, createdAt, updatedAt, documentId);
//     }

//     static async getFromFirestore(documentId: string): Promise<UserDB | null> {
//         const data = await this.getData(documentId);
//         if (data) {
//             return this.fromFirestore(data, documentId);
//         }
//         return null;
//     }

//     static async getAll(constraints: QueryConstraint[] = []): Promise<UserDB[]> {
//         const snapshots = await this.getAllSnapshots(constraints);
//         return snapshots.map(snapshot => this.fromFirestore(snapshot.data, snapshot.documentId));
//     }
// }
