import { NavigateFunction } from "react-router-dom";
import serviceFactory from "../../../firebase/db/factory";
import { SpaceStartFormState } from "../../../types/app/space/spaceTypes";
import { spacePaths } from "../../../types/path/mainPaths";
import { replaceParams } from "../../path/pathUtils";
import { PathParam } from "../../../types/path/paths";
import { Dispatch } from "@reduxjs/toolkit";
import { setCurrentSpaceId } from "../../../redux/slices/space/spaceSlice";
import { startLearningSession } from "./learningSessionUtils";


/**
 * 新しいスペースを作成します。ユーザーIDとフォーム状態に基づいてスペースの詳細を指定します。
 *
 * @param formState - 作成するスペースの詳細を含むフォームの状態。
 * @param uid - スペースを作成するユーザーのID。
 * @param setIsStartingSpace - スペース作成中の状態を設定する関数。
 * @param navigate - ページ遷移を行うための関数。
 * @param dispatch - Reduxのディスパッチ関数。
 */
export const startNewSpace = async (
    formState: SpaceStartFormState,
    uid: string,
    setIsStartingSpace: React.Dispatch<React.SetStateAction<boolean>>,
    navigate: NavigateFunction,
    dispatch: Dispatch,
) => {
    try {
        setIsStartingSpace(true);
        const userService = serviceFactory.createUserService();
        const spaceService = serviceFactory.createSpaceService();

        await userService.startLearning(uid);

        // スペースの作成処理
        const spaceRef = await spaceService.createSpace(
            uid,
            formState.spaceName,
            formState.description,
            formState.publicationTarget,
            formState.requiresApproval
        );

        const newSpaceId = spaceRef.id;
        navigate(replaceParams(spacePaths.home, { [PathParam.SpaceId]: newSpaceId }));
        dispatch(setCurrentSpaceId(newSpaceId));

        // スペース参加のためのストレージ設定
        startLearningSession(dispatch, uid, newSpaceId);
    } catch (error) {
        console.error("新しいスペースの作成に失敗しました:", error);
        // エラーハンドリングの追加
        // 必要に応じてユーザーへの通知やログ出力を追加できます。
    } finally {
        setIsStartingSpace(false);
    }
};
