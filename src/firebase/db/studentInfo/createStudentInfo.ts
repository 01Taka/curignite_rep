import { validateSchoolId } from "../schools/validateSchools";
import { isUsernameTaken } from "../users/getUser";
import { StudentInfoDB } from "./studentInfo";

export const createStudentInfoDB = async (username: string, grade: number, classNumber: number, schoolId: string): Promise<StudentInfoDB> => {
    if (await isUsernameTaken(username)) {
        throw new Error(`このユーザー名は既に使用されています。${username}`);
    }

    try {
        await validateSchoolId(schoolId);
        const studentInfo = new StudentInfoDB(username, grade, classNumber, schoolId);
        return studentInfo;
    } catch (error) {
        throw error;
    }
}
