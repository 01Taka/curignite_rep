import { Timestamp, DocumentData } from "firebase/firestore"; 

export class UserDB {
    uid: string;
    studentInfo: DocumentData;
    createdAt: Timestamp; // FirestoreのTimestamp型を使用する
    updatedAt: Timestamp;

    constructor(uid: string, studentInfo: DocumentData, createdAt?: Timestamp, updatedAt?: Timestamp) {
        this.uid = uid;
        this.studentInfo = studentInfo;
        this.createdAt = createdAt ? createdAt : Timestamp.now(); // FirestoreのTimestamp型に変換
        this.updatedAt = updatedAt ? updatedAt : Timestamp.now();
    }

    // Firestoreのデータ形式に変換するメソッド
    toFirestore() {
        return {
            uid: this.uid,
            studentInfo: this.studentInfo,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    // FirestoreからのデータをUserクラスに変換するメソッド
    static fromFirestore(data: DocumentData) {
        const { uid, studentInfo, createdAt, updatedAt } = data;
        return new UserDB(uid, studentInfo, createdAt, updatedAt);
    }

    getStudentInfo() {
        return this.studentInfo;
    }
}
