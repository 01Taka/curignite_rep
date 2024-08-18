import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import { TaskCollectionBatchTaskData, TaskPriority } from "../../../../../../types/firebase/db/todo/TodoTypes";
import BaseDB from "../../../../base";
import { getInitialBaseDocumentData } from "../../../../../../functions/db/dbUtils";

class TaskCollectionBatchTasksDB extends BaseDB<TaskCollectionBatchTaskData> {
    constructor(firestore: Firestore, taskListId: string, private taskCollectionId: string) {
        super(firestore, `taskLists/${taskListId}/taskCollections/${taskCollectionId}/batchTasks`);
    }

    /**
     * 新しいマイを作成
     * @param createdById マイの作成者のUID
     * @returns 新しく作成されたマイのドキュメントリファレンス
     */
    async createTaskCollectionBatchTask(
        createdById: string,
        title: string,
        dueDateTime: Timestamp | null,
        taskNote: string,
        priority: TaskPriority,
        pagesInRange: number[],
        completedPages: number[],
        progress: number = 0,
        completed: boolean = false,
    ): Promise<DocumentReference<DocumentData>> {
        try {
            const data: TaskCollectionBatchTaskData = {
              ...getInitialBaseDocumentData(createdById),
              title,
              dueDateTime,
              taskNote,
              priority,
              progress,
              completed,
              collectionId: this.taskCollectionId,
              pagesInRange: Array.from(new Set(pagesInRange)),
              completedPages: Array.from(new Set(completedPages)),
            };
            return this.create(data);
        } catch (error) {
            console.error("Error creating taskCollectionBatchTask: ", error);
            throw new Error("Failed to create taskCollectionBatchTask"); // エラー発生時にカスタムエラーメッセージをスロー
        }
    }

    /**
     * マイデータを取得
     * @param taskCollectionBatchTaskId マイID
     * @returns マイデータ
     */
    async getTaskCollectionBatchTask(taskCollectionBatchTaskId: string): Promise<TaskCollectionBatchTaskData | null> {
        try {
            return await this.read(taskCollectionBatchTaskId);
        } catch (error) {
            console.error("Failed to get taskCollectionBatchTask data: ", error);
            return null;
        }
    }

    async getAllTaskCollectionBatchTask(): Promise<TaskCollectionBatchTaskData[]> {
        try {
            return await this.getAll();
        } catch (error) {
            console.error("Failed to get all taskCollectionBatchTasks data: ", error);
            return [];
        }
    }

    /**
     * マイデータを更新
     * @param taskCollectionBatchTaskId マイID
     * @param data 更新するデータ
     */
    async updateTaskCollectionBatchTask(taskCollectionBatchTaskId: string, data: Partial<TaskCollectionBatchTaskData>): Promise<void> {
        try {
            await this.update(taskCollectionBatchTaskId, data);
        } catch (error) {
            console.error("Failed to update taskCollectionBatchTask data: ", error);
            throw new Error("Failed to update taskCollectionBatchTask data");
        }
    }

    /**
     * マイデータを削除
     * @param taskCollectionBatchTaskId マイID
     */
    async deleteTaskCollectionBatchTask(taskCollectionBatchTaskId: string): Promise<void> {
        try {
            await this.softDelete(taskCollectionBatchTaskId);
        } catch (error) {
            console.error("Failed to delete taskCollectionBatchTask data: ", error);
            throw new Error("Failed to delete taskCollectionBatchTask data");
        }
    }
}

export default TaskCollectionBatchTasksDB;
