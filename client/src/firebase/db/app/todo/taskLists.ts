import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import { TaskListData, TaskParentType } from "../../../../types/firebase/db/todo/TodoTypes";
import BaseDB from "../../base";
import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";

class TaskListsDB extends BaseDB<TaskListData> {
    constructor(firestore: Firestore) {
        super(firestore, "taskLists");
    }

    /**
     * 新しいタスク一覧を作成
     * @param createdById タスク一覧の作成者のUID
     * @returns 新しく作成されたタスク一覧のドキュメントリファレンス
     */
    async createTaskList(
        createdById: string,
        parentId: string,
        parentType: TaskParentType,
    ): Promise<DocumentReference<DocumentData>> {
        try {
            const data: TaskListData = {
              ...getInitialBaseDocumentData(createdById),
              parentId,
              parentType,
            };
            return this.create(data);
        } catch (error) {
            console.error("Error creating taskList: ", error);
            throw new Error("Failed to create tasklist"); // エラー発生時にカスタムエラーメッセージをスロー
        }
    }

    /**
     * タスク一覧データを取得
     * @param taskListId タスク一覧ID
     * @returns タスク一覧データ
     */
    async getTaskList(taskListId: string): Promise<TaskListData | null> {
        try {
            return await this.read(taskListId);
        } catch (error) {
            console.error("Failed to get taskList data: ", error);
            return null;
        }
    }

    /**
     * タスク一覧データを更新
     * @param taskListId タスク一覧ID
     * @param data 更新するデータ
     */
    async updateTaskList(taskListId: string, data: Partial<TaskListData>): Promise<void> {
        try {
            await this.update(taskListId, data);
        } catch (error) {
            console.error("Failed to update taskList data: ", error);
            throw new Error("Failed to update taskList data");
        }
    }

    /**
     * タスク一覧データを削除
     * @param taskListId タスク一覧ID
     */
    async deleteTaskList(taskListId: string): Promise<void> {
        try {
            await this.softDelete(taskListId);
        } catch (error) {
            console.error("Failed to delete taskList data: ", error);
            throw new Error("Failed to delete taskList data");
        }
    }
}

export default TaskListsDB;
