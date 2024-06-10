import { ref, uploadBytes } from "firebase/storage"
import { storage } from "../firebase"

export const uploadFile = (path: string, fileName: string, file: File) => {
    const storageRef = ref(storage, `${path}/${fileName}`);

    try {
        uploadBytes(storageRef, file);
    } catch (error) {
        console.error(error);
    }
} 