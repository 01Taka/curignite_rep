import { collection, query, where, getDocs, limit, QuerySnapshot, DocumentData, DocumentReference, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Fetches the first document snapshot matching the specified field and value from a collection.
 * @param collectionName - The name of the collection.
 * @param field - The field to filter by.
 * @param value - The value to filter by.
 * @returns A promise resolving to the first document snapshot.
 */
export const getSnapshotFirst = async (collectionName: string, field: string, value: string): Promise<QuerySnapshot<DocumentData>> => {
    try {
        const q = query(collection(db, collectionName), where(field, "==", value), limit(1));
        const querySnapshot = await getDocs(q);
        return querySnapshot;
    } catch (error) {
        console.error("Error getting documents: ", error);
        throw error;
    }
};

/**
 * Fetches the first document matching the specified field and value from a collection.
 * @param collectionName - The name of the collection.
 * @param field - The field to filter by.
 * @param value - The value to filter by.
 * @returns A promise resolving to the first document or null if no document matches.
 */
export const getDocFirst = async (collectionName: string, field: string, value: string): Promise<QueryDocumentSnapshot<DocumentData> | null> => {
    try {
        const querySnapshot = await getSnapshotFirst(collectionName, field, value);
        if (!querySnapshot.empty) {
            console.log("#######", querySnapshot.docs);
            
            return querySnapshot.docs[0];
        }
        return null;
    } catch (error) {
        console.error("Error getting document: ", error);
        throw error;
    }
};

/**
 * Fetches the data of the first document matching the specified field and value from a collection.
 * @param collectionName - The name of the collection.
 * @param field - The field to filter by.
 * @param value - The value to filter by.
 * @returns A promise resolving to the data of the first document or null if no document matches.
 */
export const getDataFirst = async (collectionName: string, field: string, value: string): Promise<DocumentData | null> => {
    try {
        const doc = await getDocFirst(collectionName, field, value);
        if (doc) {
            return doc.data();
        }
        return null;
    } catch (error) {
        console.error("Error getting document data: ", error);
        throw error;
    }
};

/**
 * Fetches the reference of the first document matching the specified field and value from a collection.
 * @param collectionName - The name of the collection.
 * @param field - The field to filter by.
 * @param value - The value to filter by.
 * @returns A promise resolving to the reference of the first document or null if no document matches.
 */
export const getRefFirst = async (collectionName: string, field: string, value: string): Promise<DocumentReference | null> => {
    try {
        const doc = await getDocFirst(collectionName, field, value);
        if (doc) {
            return doc.ref;
        }
        return null;
    } catch (error) {
        console.error("Error getting document reference: ", error);
        throw error;
    }
};
