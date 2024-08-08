import { TimestampConvertedDocumentMap } from "../../../firebase/db/formatTypes";
import { SpaceData } from "../../../firebase/db/space/spacesTypes";
import { AsyncThunkState } from "../asyncThunkTypes";

export interface SpaceSliceState {
  currentSpaceId: string;
  spaces: TimestampConvertedDocumentMap<SpaceData>;
  spacesFetchState: AsyncThunkState<TimestampConvertedDocumentMap<SpaceData>>;
}
