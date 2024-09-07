import { Firestore, QueryConstraint } from "firebase/firestore";
import BaseDB from "../../base";
import { TaskCollectionData } from "../../../../types/firebase/db/common/task/taskStructure";
import { DocumentIdMap } from "../../../../types/firebase/db/formatTypes";
import { objectArrayToDict } from "../../../../functions/objectUtils";
import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";

export class TaskCollectionService {
  constructor(private firestore: Firestore, private path: string) {}

  createBaseDB(docId: string): BaseDB<TaskCollectionData> {
    return new BaseDB(this.firestore, `${this.path}/${docId}/taskCollections`);
  }

  async createCollection(
    docId: string,
    createdById: string,
    collectionName: string,
    description: string,
    totalPages: number,
    timePerPage: number,
    completedPageIndices: number[] = [],
  ): Promise<void> {
    try {
      const data: TaskCollectionData = {
        ...getInitialBaseDocumentData(createdById),
        collectionName,
        description,
        totalPages,
        timePerPage,
        completedPageIndices,
      }
      await this.createBaseDB(docId).create(data);
    } catch (error) {
      console.error("Error creating collection: ", error);
      throw new Error("Failed to create collection");
    }
  }

  async getTaskCollectionMap(docId: string): Promise<DocumentIdMap<TaskCollectionData>> {
    const collections = await this.getAllCollections(docId);
    return objectArrayToDict(collections, "docId");
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