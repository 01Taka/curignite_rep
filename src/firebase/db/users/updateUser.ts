import { DocumentData } from "firebase/firestore";
import { updateData } from "../updateData";
import { isUsernameTaken } from "./getUser";

export const renameUserByEmail = async (email: string, newName: string) => {
    const isUniqueName = !await isUsernameTaken(newName);
    console.log(isUniqueName);
    

    if (isUniqueName) {
        try {
            const newData: DocumentData = {
                username: newName
            };
            console.log(newData);
            
            updateData('users', 'email', email, newData);
        } catch (error) {
            console.log(error);
        }
    }
}
