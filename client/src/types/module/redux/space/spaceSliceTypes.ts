import { JoinRequestData } from "../../../firebase/db/common/joinRequest/joinRequestStructure";
import { TimestampConvertedDocumentMap } from "../../../firebase/db/formatTypes";
import { SpaceData, SpaceMemberData } from "../../../firebase/db/space/spaceStructure";
import { AsyncThunkStatus } from "../asyncThunkTypes";

export interface SpaceInfoMap {
  space: SpaceData;
  members?: SpaceMemberData[];
  joinRequests: JoinRequestData[];
}

export interface SpaceSliceState {
  currentSpaceId: string;
  spaceInfoMap: TimestampConvertedDocumentMap<SpaceInfoMap>;
  spaceInfoUpdateState: AsyncThunkStatus;
}
