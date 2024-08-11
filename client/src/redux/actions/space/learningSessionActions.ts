import { Dispatch } from "@reduxjs/toolkit";
import { clearLearningSession, setEndTime, setLearningTime, setSpaceId, setStartTime } from "../../slices/space/learningSessionSlice";
import { learningSessionStorage } from "../../../functions/localStorage/storages";
import { TimeTypes } from "../../../types/util/dateTimeTypes";
import { convertTimeForStorage } from "../../../functions/localStorage/localStorageUtils";
import { convertToMilliseconds } from "../../../functions/dateTimeUtils";
import { getLearningStoragePassword } from "../../../functions/app/space/learningSessionUtils";
import { LearningSession } from "../../../types/app/space/learningSessionTypes";

export const loadData = (dispatch: Dispatch, userId: string) => {
  const spaceId = learningSessionStorage.getData("spaceId");
  if (!spaceId) return;

  const password = getLearningStoragePassword(userId, spaceId);

  dispatch(setSpaceId(spaceId));

  const timeData: Array<{ time: keyof LearningSession; action: (value: number) => any }> = [
    { time: "startTime", action: setStartTime },
    { time: "endTime", action: setEndTime },
    { time: "learningTime", action: setLearningTime }
  ];

  timeData.forEach(({ time, action }) => {
    const value = learningSessionStorage.getData(time, undefined, password);
    if (value && Number(value) !== 0) {
      dispatch(action(Number(value)));
    }
  });
};

export const saveSpaceId = (spaceId: string, dispatch: Dispatch) => {
  dispatch(setSpaceId(spaceId));
  learningSessionStorage.setData("spaceId", spaceId);
};

export const saveStartTime = (startTime: TimeTypes, password: string, dispatch: Dispatch) => {
  dispatch(setStartTime(convertToMilliseconds(startTime)));
  learningSessionStorage.setData('startTime', convertTimeForStorage(startTime), undefined, password);
};

export const saveEndTime = (endTime: TimeTypes, password: string, dispatch: Dispatch) => {
  dispatch(setEndTime(convertToMilliseconds(endTime)));
  learningSessionStorage.setData('endTime', convertTimeForStorage(endTime), undefined, password);
};

export const saveLearningTime = (learningTime: TimeTypes, password: string, dispatch: Dispatch) => {
  dispatch(setLearningTime(convertToMilliseconds(learningTime)));
  learningSessionStorage.setData('learningTime', convertTimeForStorage(learningTime), undefined, password);
};

export const clearData = (dispatch: Dispatch) => {
  dispatch(clearLearningSession());
  learningSessionStorage.clear();
}