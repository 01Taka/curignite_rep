import { BaseMemberRole } from "../../../types/firebase/db/baseTypes";
import { SpaceData } from "../../../types/firebase/db/space/spaceStructure";
import { sortByOrder } from "../../objectUtils";

export const sortSpaceMembers = (space: SpaceData) => {
  const order: BaseMemberRole[] = [BaseMemberRole.Admin, BaseMemberRole.Moderator, BaseMemberRole.Member, BaseMemberRole.Guest];
  const sortedMembers = sortByOrder(space.members, order, "role");
  const sortedAway = sortByOrder(space.awayUsers, order, "role");
  const sortedMembersAndAwayUsers = [...sortedMembers, ...sortedAway];
  return sortedMembersAndAwayUsers;
}

// export const sortJoinRequestsByActionTime = (space: SpaceData): ActionInfo<SpaceActionTypes>[] => {
//   const allRequests = [
//     ...space.pendingRequests,
//     ...space.rejectedUsers,
//     ...space.approvedUsers,
//   ];
//   return sortArray(allRequests, "actionAt");
// }
