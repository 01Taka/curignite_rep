import { TimestampConvertedDocumentMap } from "../../../firebase/db/formatTypes";
import { SpaceData } from "../../../firebase/db/space/spacesTypes";
import { AsyncThunkState, AsyncThunkStatus } from "../asyncThunkTypes";

export interface SpaceSliceState {
  currentSpaceId: string;
  spaces: TimestampConvertedDocumentMap<SpaceData>;
  todayTotalLearningTime: number;
  updateTotalLearningTimeState: AsyncThunkState<number>,
  spacesUpdateState: AsyncThunkStatus;
}
