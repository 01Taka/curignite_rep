import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";

export const getFileUrl = async (path: string, fileName: string): Promise<string> => {
    const storageRef = ref(storage, `${path}/${fileName}`);
    try {
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.error('Failed to get file URL', error);
        return "";
    }
};