import { Timestamp } from "firebase/firestore";
import { RoleType } from "../types/firebase/db/baseTypes";
import { SpaceData, SpacePermissionType, SpacePublicationTarget } from "../types/firebase/db/space/spacesTypes";
import {
  TaskListIndividualTaskData,
  TaskListTaskCollectionData,
  TaskCollectionBatchTaskData,
  TaskPriority,
} from "../types/firebase/db/todo/TodoTypes"; // 適切なファイルパスに変更してください

// TaskListIndividualTaskDataのサンプルデータ
export const sampleTaskListIndividualTaskData: TaskListIndividualTaskData = {
  docId: "individualTask123",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  isActive: true,
  createdById: "user123",
  title: "Individual Task Sample",
  dueDateTime: Timestamp.fromDate(new Date(2024, 7, 18, 17, 30)),
  taskNote: "",
  priority: "high" as TaskPriority,
  progress: 50,
  completed: false,
  estimatedDuration: 7200000, // 2 hours in milliseconds
};

// TaskListTaskCollectionDataのサンプルデータ
export const sampleTaskListTaskCollectionData: TaskListTaskCollectionData = {
  docId: "taskCollection123",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  isActive: true,
  createdById: "user123",
  name: "Sample Task Collection",
  totalPages: 10,
  timePerPage: 1800000, // 30 minutes per page in milliseconds
  completedPageIndices: [1, 3, 5],
  description: "This is a sample task collection description.",
};

// TaskCollectionBatchTaskDataのサンプルデータ
export const sampleTaskCollectionBatchTaskData: TaskCollectionBatchTaskData = {
  docId: "batchTask123",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  isActive: true,
  createdById: "user123",
  title: "Batch Task Sample",
  dueDateTime: Timestamp.fromDate(new Date(2024, 11, 30, 12, 0)),
  taskNote: "This is a sample note for a batch task.",
  priority: "medium" as TaskPriority,
  progress: 75,
  completed: false,
  collectionId: "taskCollection123",
  pagesInRange: [2, 3, 4],
  completedPages: [2, 4],
};

export const sampleSpaceData: SpaceData = {
  docId: "space123",
  createdAt: Timestamp.fromDate(new Date("2023-01-01T10:00:00Z")),
  updatedAt: Timestamp.fromDate(new Date("2023-01-02T10:00:00Z")),
  isActive: true,
  createdById: "user123",
  spaceName: "Sample Space",
  iconUrl: "https://example.com/icon.png",
  description: "This is a sample space for demonstration purposes.",
  requiresApproval: true,
  publicationTarget: SpacePublicationTarget.Team,
  members: [
    {
      userId: "user123",
      username: "AdminUser",
      iconUrl: "https://example.com/admin.png",
      role: RoleType.Admin,
    },
    {
      userId: "user456",
      username: "MemberUser",
      iconUrl: "https://example.com/member.png",
      role: RoleType.Member,
    },
  ],
  permissions: {
    [RoleType.Admin]: [
      SpacePermissionType.ManageSpace,
      SpacePermissionType.ViewSpace,
      SpacePermissionType.EditSpace,
      SpacePermissionType.DeleteSpace,
      SpacePermissionType.ManageMembers,
      SpacePermissionType.InviteMembers,
      SpacePermissionType.ApproveRequests,
      SpacePermissionType.RejectRequests,
    ],
    [RoleType.Member]: [SpacePermissionType.ViewSpace],
    [RoleType.Guest]: [SpacePermissionType.ViewSpace],
  },
  awayUsers: [
    {
      userId: "user789",
      username: "AwayUser",
      iconUrl: "https://example.com/away.png",
      role: RoleType.Member,
    },
  ],
  pendingRequests: [
    {
      actionType: "pending",
      userId: "user101",
      actionAt: Timestamp.fromDate(new Date("2023-01-03T10:00:00Z")),
    },
  ],
  approvedUsers: [
    {
      actionType: "approved",
      userId: "user102",
      actionAt: Timestamp.fromDate(new Date("2023-01-04T10:00:00Z")),
    },
  ],
  invitedUsers: [
    {
      actionType: "invited",
      userId: "user103",
      actionAt: Timestamp.fromDate(new Date("2023-01-05T10:00:00Z")),
    },
  ],
  rejectedUsers: [
    {
      actionType: "rejected",
      userId: "user104",
      actionAt: Timestamp.fromDate(new Date("2023-01-06T10:00:00Z")),
    },
  ],
  chatRoomId: "chat123",
};
