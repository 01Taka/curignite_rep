// import { DocumentData, Timestamp } from "firebase/firestore";
// import { AnonymousStatus } from "../../../../types/app/appTypes";

// export class StudentInfoDB {
//     username: string;
//     grade: number;
//     classNumber: number;
//     schoolId: string | null;
//     anonymousStatus: AnonymousStatus;
//     joinedAt: Timestamp;

//     constructor(username: string, grade: number, classNumber: number, schoolId: string, anonymousStatus: AnonymousStatus, joinedAt: Timestamp) {
//         this.username = username;
//         this.grade = grade;
//         this.classNumber = classNumber;
//         this.schoolId = schoolId;
//         this.anonymousStatus = anonymousStatus;
//         this.joinedAt = joinedAt;
//     }

//     toFirestore(): DocumentData {
//         return {
//             username: this.username,
//             grade: this.grade,
//             classNumber: this.classNumber,
//             schoolId: this.schoolId,
//             anonymousStatus: this.anonymousStatus,
//             joinedAt: this.joinedAt,
//         };
//     }    

//     static fromFirestore(data: DocumentData) {
//         const { username, grade, classNumber, schoolId, anonymousStatus, joinedAt } = data;
//         return new StudentInfoDB(username, grade, classNumber, schoolId, anonymousStatus, joinedAt);
//     }

//     static getEmptyStudentInfo() {
//         return new StudentInfoDB("", 0, 0, "", "private", Timestamp.now());
//     }
// }