import { DocumentData, QueryDocumentSnapshot, doc, getDoc } from "firebase/firestore";
import { getDocFirst } from "../../getData";
import { db } from "../../../firebase";

/**
 * Fetches the document snapshot of a school by its name.
 * @param schoolName - The name of the school.
 * @returns A promise resolving to the document snapshot or null if not found.
 */
const getSchoolDocByName = async (schoolName: string): Promise<QueryDocumentSnapshot<DocumentData> | null> => {
    try {
        return await getDocFirst('schools', 'name', schoolName);
    } catch (error) {
        console.error("Error fetching school document by name: ", error);
        throw new Error("Failed to fetch school document.");
    }
};

/**
 * Extracts the password from the school document snapshot.
 * @param schoolDoc - The document snapshot of the school.
 * @returns The password string.
 */
const getSchoolPasswordFromDoc = (schoolDoc: QueryDocumentSnapshot<DocumentData>): string => {
    const data = schoolDoc.data();
    return data.password || "";
};

/**
 * Validates the school by its name and password.
 * @param schoolName - The name of the school.
 * @param password - The password to validate.
 * @returns A promise resolving to the school document ID if validation is successful.
 */
export const getSchoolIdWithNameAndPassword = async (schoolName: string, password: string): Promise<string> => {
    const schoolDoc = await getSchoolDocByName(schoolName);

    if (!schoolDoc) {
        throw new Error("一致する学校名はありません。");
    }

    const storedPassword = getSchoolPasswordFromDoc(schoolDoc);

    if (storedPassword && password === storedPassword) {
        return schoolDoc.id;
    } else {
        throw new Error("学校名とパスワードが一致しません。");
    }
};

/**
 * Validates the school by its document ID.
 * @param schoolId - The document ID of the school.
 * @returns A promise resolving to the school document ID if validation is successful.
 */
export const validateSchoolId = async (schoolId: string): Promise<string> => {
    if (!schoolId || typeof schoolId !== 'string') {
        throw new Error("有効な学校IDを提供してください。");
    }

    try {
        const schoolDocRef = doc(db, "schools", schoolId);
        const schoolDoc = await getDoc(schoolDocRef);

        if (schoolDoc.exists()) {
            return schoolDoc.id;
        } else {
            throw new Error("一致する学校IDはありません。");
        }
    } catch (error) {
        console.error("Error validating school ID: ", error);
        throw new Error("Failed to validate school ID.");
    }
};