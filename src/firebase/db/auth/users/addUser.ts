// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../../../firebase";
// import { UserDB } from "./user";
// import { StudentInfoDB } from "../studentInfo/studentInfo";

// /**
//  * Adds a new user to the Firestore database.
//  * @param user - The user object to add.
//  */
// const addUser = async (user: UserDB): Promise<void> => {
//     try {
//         const userData = user.toFirestore(); // Convert User class instance to Firestore data format
//         await addDoc(collection(db, "users"), userData); // Add document to Firestore collection
//         console.log("New user added successfully.");
//     } catch (error) {
//         console.error("Error adding document: ", error);
//         throw new Error("Failed to add new user to the database.");
//     }
// };

// /**
//  * Adds a new user to the database with the specified UID and student information.
//  * @param uid - The UID of the user.
//  * @param studentInfo - The student information associated with the user.
//  */
// export const addNewUser = async (uid: string, studentInfo: StudentInfoDB): Promise<void> => {
//     console.log(studentInfo.toFirestore());
    
//     const newUser = new UserDB(uid, studentInfo.toFirestore());
//     await addUser(newUser);
// };
