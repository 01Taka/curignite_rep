import { TimestampConvertedDocumentMap } from "../../../firebase/db/formatTypes";
import { SpaceData } from "../../../firebase/db/space/spacesTypes";
import { AsyncThunkStatus } from "../asyncThunkTypes";

export interface SpaceSliceState {
  currentSpaceId: string;
  spaces: TimestampConvertedDocumentMap<SpaceData>;
  spacesUpdateState: AsyncThunkStatus;
}
