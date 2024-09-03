import { ActionInfo, RoleType } from "../../../types/firebase/db/baseTypes";
import { SpaceActionTypes, SpaceData } from "../../../types/firebase/db/space/spaceStructure";
import { sortArray, sortByOrder } from "../../objectUtils";

export const sortSpaceMembers = (space: SpaceData) => {
  const order: RoleType[] = [RoleType.Admin, RoleType.Member, RoleType.Member];
  const sortedMembers = sortByOrder(space.members, order, "role");
  const sortedAway = sortByOrder(space.awayUsers, order, "role");
  const sortedMembersAndAwayUsers = [...sortedMembers, ...sortedAway];
  return sortedMembersAndAwayUsers;
}

export const sortJoinRequestsByActionTime = (space: SpaceData): ActionInfo<SpaceActionTypes>[] => {
  const allRequests = [
    ...space.pendingRequests,
    ...space.rejectedUsers,
    ...space.approvedUsers,
  ];
  return sortArray(allRequests, "actionAt");
}
