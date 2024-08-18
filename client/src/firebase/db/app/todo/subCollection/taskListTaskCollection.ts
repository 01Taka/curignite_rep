import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import { TaskListTaskCollectionData } from "../../../../../types/firebase/db/todo/TodoTypes";
import BaseDB from "../../../base";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";

class TaskListTaskCollectionsDB extends BaseDB<TaskListTaskCollectionData> {
    constructor(firestore: Firestore, taskListId: string) {
        super(firestore, `taskLists/${taskListId}/taskCollections`);
    }

    /**
     * 新しいマイを作成
     * @param createdById マイの作成者のUID
     * @returns 新しく作成されたマイのドキュメントリファレンス
     */
    async createTaskListTaskCollection(
        createdById: string,
        name: string,
        totalPages: number, 
        timePerPage: number,
        completedPageIndices: number[],
        description: string,
    ): Promise<DocumentReference<DocumentData>> {
        try {
            const data: TaskListTaskCollectionData = {
              ...getInitialBaseDocumentData(createdById),
              name,
              totalPages,
              timePerPage,
              completedPageIndices: Array.from(new Set(completedPageIndices)),
              description,
            };
            return this.create(data);
        } catch (error) {
            console.error("Error creating taskListTaskCollection: ", error);
            throw new Error("Failed to create taskListTaskCollection"); // エラー発生時にカスタムエラーメッセージをスロー
        }
    }

    /**
     * マイデータを取得
     * @param taskListTaskCollectionId マイID
     * @returns マイデータ
     */
    async getTaskListTaskCollection(taskListTaskCollectionId: string): Promise<TaskListTaskCollectionData | null> {
        try {
            return await this.read(taskListTaskCollectionId);
        } catch (error) {
            console.error("Failed to get taskListTaskCollection data: ", error);
            return null;
        }
    }

    async getAllListTaskCollections(): Promise<TaskListTaskCollectionData[]> {
        try {
            return await this.getAll();
        } catch (error) {
            console.error("Failed to get all taskListTaskCollections data: ", error);
            return [];
        }
    }

    /**
     * マイデータを更新
     * @param taskListTaskCollectionId マイID
     * @param data 更新するデータ
     */
    async updateTaskListTaskCollection(taskListTaskCollectionId: string, data: Partial<TaskListTaskCollectionData>): Promise<void> {
        try {
            await this.update(taskListTaskCollectionId, data);
        } catch (error) {
            console.error("Failed to update taskListTaskCollection data: ", error);
            throw new Error("Failed to update taskListTaskCollection data");
        }
    }

    /**
     * マイデータを削除
     * @param taskListTaskCollectionId マイID
     */
    async deleteTaskListTaskCollection(taskListTaskCollectionId: string): Promise<void> {
        try {
            await this.softDelete(taskListTaskCollectionId);
        } catch (error) {
            console.error("Failed to delete taskListTaskCollection data: ", error);
            throw new Error("Failed to delete taskListTaskCollection data");
        }
    }
}

export default TaskListTaskCollectionsDB;

