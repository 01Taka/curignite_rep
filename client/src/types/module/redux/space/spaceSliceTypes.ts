import { TimestampConvertedDocumentMap } from "../../../firebase/db/formatTypes";
import { SpaceFullData } from "../../../firebase/db/space/spaceStructure";
import { AsyncThunkState, AsyncThunkStatus } from "../asyncThunkTypes";

export interface SpaceSliceState {
  currentSpaceId: string;
  spaceInfoMap: TimestampConvertedDocumentMap<Partial<SpaceFullData>>;
  todayTotalLearningTime: number;
  updateTotalLearningTimeState: AsyncThunkState<number>,
  spacesUpdateState: AsyncThunkStatus;
}
