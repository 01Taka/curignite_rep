export type ChatRoomParentType = "team" | "space" | "friend";
export type ChatStatusType = 'sent' | 'delivered' | 'read' | 'failed' | 'error';
// export type ChatThreadStatus = 'active' | 'archived' | 'deleted';

export interface ChatRoomRelationships {
  parentId: string;
  parentType: ChatRoomParentType;
}
