import serviceFactory from "../../../../firebase/db/factory";

export type FinishType = 'delete' | 'leave' | 'away' | 'archiving' | 'continuation';

const spaceMemberService = serviceFactory.createSpaceMemberService();
const spaceService = serviceFactory.createSpaceService();

export const handleFinishSpace = async (spaceId: string, userId: string, finishType: FinishType) => {
  try {
    switch (finishType) {
      case "delete":
        await spaceService.deleteSpace(spaceId);
        break;
      case "leave":
        await spaceMemberService.leaveSpace(spaceId, userId);
        break;
      case "away":
        await spaceMemberService.setAwayState(spaceId, userId, true);
        break;
      case "archiving":
        // TODO: Implement archiving logic
        console.warn("Archiving functionality is not yet implemented.");
        break;
      case "continuation":
        // Handle continuation case if needed
        console.info("Continuation selected. No action taken.");
        break;
      default:
        throw new Error(`Unknown finish type: ${finishType}`);
    }
  } catch (error) {
    console.error(`Error handling finish space action`, error);
    // Consider re-throwing or handling the error further based on your application needs
  }
}

export const finishSpaceWithTransferPrivileges = async (spaceId: string, assignorUserId: string, transfereeUserId: string) => {
  try {
    await spaceMemberService.transferPrivileges(spaceId, assignorUserId, transfereeUserId);
    await spaceMemberService.leaveSpace(spaceId, assignorUserId);
  } catch (error) {
    console.error(`Error finishing space with privilege transfer`, error);
    // Consider re-throwing or handling the error further based on your application needs
  }
}
