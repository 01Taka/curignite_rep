import { DocumentData } from "firebase/firestore";

export class StudentInfoDB {
    username: string;
    grade: number;
    classNumber: number;
    schoolId: string;

    constructor(username: string, grade: number, classNumber: number, schoolId: string) {
        this.username = username;
        this.grade = grade;
        this.classNumber = classNumber;
        this.schoolId = schoolId;
    }

    toFirestore(): DocumentData {
        return {
            studentInfo: {
                username: this.username,
                grade: this.grade,
                classNumber: this.classNumber,
                schoolId: this.schoolId,
            }
        };
    }    

    static fromFirestore(data: DocumentData) {
        const { username, grade, classNumber, schoolId } = data;
        return new StudentInfoDB(username, grade, classNumber, schoolId);
    }
}