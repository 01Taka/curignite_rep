import { DocumentData, updateDoc } from "firebase/firestore";
import { getRefFirst } from "./getData";

const updateData = async (collectionName: string, type: string, value: string, data: DocumentData) => {
    try {
        const userRef = await getRefFirst(collectionName, type, value);

        if (userRef) {
            await updateDoc(userRef, data);
        } else {
            console.error(`User not found with ${type}: ${value}`);
            throw new Error('404');
        }
    } catch (error) {
        console.error(`Error updating: ${error}`);
        throw error;
    }
}
