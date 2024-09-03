import { Firestore, QueryConstraint } from "firebase/firestore";
import BaseDB from "../../base";
import { TaskCollectionData } from "../../../../types/firebase/db/common/task/taskStructure";
import { DocumentIdMap } from "../../../../types/firebase/db/formatTypes";
import { arrayToDict } from "../../../../functions/objectUtils";

export class TaskCollectionService {
  constructor(private firestore: Firestore, private path: string) {}

  createBaseDB(docId: string): BaseDB<TaskCollectionData> {
    return new BaseDB(this.firestore, `${this.path}/${docId}/taskCollections`);
  }

  async getTaskCollectionMap(docId: string): Promise<DocumentIdMap<TaskCollectionData>> {
    const collections = await this.getAllCollections(docId);
    return arrayToDict(collections, "docId");
  }

  async createCollection(docId: string, collectionId: string, data: TaskCollectionData): Promise<void> {
    try {
      await this.createBaseDB(docId).createWithId(collectionId, data);
    } catch (error) {
      console.error("Error creating collection: ", error);
      throw new Error("Failed to create collection");
    }
  }

  async getCollection(docId: string, collectionId: string): Promise<TaskCollectionData | null> {
    try {
      return await this.createBaseDB(docId).read(collectionId);
    } catch (error) {
      console.error("Error retrieving collection: ", error);
      return null;
    }
  }

  async getAllCollections(docId: string, ...queryConstraints: QueryConstraint[]): Promise<TaskCollectionData[]> {
    try {
      return await this.createBaseDB(docId).getAll(...queryConstraints);
    } catch (error) {
      console.error("Error getting all collections: ", error);
      throw new Error("Failed to get all collections");
    }
  }

  async updateCollection(docId: string, collectionId: string, data: Partial<TaskCollectionData>): Promise<void> {
    try {
      await this.createBaseDB(docId).update(collectionId, data);
    } catch (error) {
      console.error("Error updating collection: ", error);
      throw new Error("Failed to update collection");
    }
  }

  async softDeleteCollection(docId: string, collectionId: string): Promise<void> {
    try {
      await this.createBaseDB(docId).softDelete(collectionId);
    } catch (error) {
      console.error("Error soft deleting collection: ", error);
      throw new Error("Failed to soft delete collection");
    }
  }

  async hardDeleteCollection(docId: string, collectionId: string): Promise<void> {
    try {
      await this.createBaseDB(docId).hardDelete(collectionId);
    } catch (error) {
      console.error("Error hard deleting collection: ", error);
      throw new Error("Failed to hard delete collection");
    }
  }
}