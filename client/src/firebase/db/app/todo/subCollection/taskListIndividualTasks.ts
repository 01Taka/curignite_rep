import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import { TaskListIndividualTaskData, TaskPriority } from "../../../../../types/firebase/db/todo/TodoTypes";
import BaseDB from "../../../base";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";

class TaskListIndividualTasksDB extends BaseDB<TaskListIndividualTaskData> {
    constructor(firestore: Firestore, taskListId: string) {
        super(firestore, `taskLists/${taskListId}/individualTasks`);
    }

    /**
     * 新しいマイを作成
     * @param createdById マイの作成者のUID
     * @returns 新しく作成されたマイのドキュメントリファレンス
     */
    async createTaskListIndividualTask(
        createdById: string,
        title: string,
        dueDateTime: Timestamp | null,
        taskNote: string,
        priority: TaskPriority,
        estimatedDuration: number,
        progress: number = 0,
        completed: boolean = false,
    ): Promise<DocumentReference<DocumentData>> {
        try {
            const data: TaskListIndividualTaskData = {
              ...getInitialBaseDocumentData(createdById),
              title,
              dueDateTime,
              taskNote,
              priority,
              progress,
              completed,
              estimatedDuration,
            };
            return this.create(data);
        } catch (error) {
            console.error("Error creating taskListIndividualTask: ", error);
            throw new Error("Failed to create taskListIndividualTask"); // エラー発生時にカスタムエラーメッセージをスロー
        }
    }

    /**
     * マイデータを取得
     * @param taskListIndividualTaskId マイID
     * @returns マイデータ
     */
    async getTaskListIndividualTask(taskListIndividualTaskId: string): Promise<TaskListIndividualTaskData | null> {
        try {
            return await this.read(taskListIndividualTaskId);
        } catch (error) {
            console.error("Failed to get taskListIndividualTask data: ", error);
            return null;
        }
    }

    async getAllTaskListIndividualTask(): Promise<TaskListIndividualTaskData[]> {
        try {
            return await this.getAll();
        } catch (error) {
            console.error("Failed to get all taskListIndividualTasks data: ", error);
            return [];
        }
    }

    /**
     * マイデータを更新
     * @param taskListIndividualTaskId マイID
     * @param data 更新するデータ
     */
    async updateTaskListIndividualTask(taskListIndividualTaskId: string, data: Partial<TaskListIndividualTaskData>): Promise<void> {
        try {
            await this.update(taskListIndividualTaskId, data);
        } catch (error) {
            console.error("Failed to update taskListIndividualTask data: ", error);
            throw new Error("Failed to update taskListIndividualTask data");
        }
    }

    /**
     * マイデータを削除
     * @param taskListIndividualTaskId マイID
     */
    async deleteTaskListIndividualTask(taskListIndividualTaskId: string): Promise<void> {
        try {
            await this.softDelete(taskListIndividualTaskId);
        } catch (error) {
            console.error("Failed to delete taskListIndividualTask data: ", error);
            throw new Error("Failed to delete taskListIndividualTask data");
        }
    }
}

export default TaskListIndividualTasksDB;

