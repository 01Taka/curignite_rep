import { SerializableSpaceData } from "../../../firebase/db/space/spacesTypes";
import { AsyncThunkState } from "../asyncThunkTypes";

export interface SpaceSliceState {
  currentSpace: SerializableSpaceData | null;
  spaces: SerializableSpaceData[];
  currentSpaceFetchState: AsyncThunkState<SerializableSpaceData | null>;
  spacesFetchState: AsyncThunkState<SerializableSpaceData[]>;
}
