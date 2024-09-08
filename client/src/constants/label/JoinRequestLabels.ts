import { JoinRequestStatus } from "../../types/firebase/db/common/joinRequest/joinRequestSupplementTypes";
import { HexColorCode } from "../../types/util/utilTypes";

export const JoinRequestStatusLabels: Record<JoinRequestStatus, string> = {
  pending: "保留中",
  rejected: "拒否中",
  allowed: "許可中",
};

export const JoinRequestStatusColors: Record<JoinRequestStatus, HexColorCode> = {
  pending: "#FFA500",  // オレンジ色 (保留中)
  rejected: "#FF0000", // 赤色 (拒否された)
  allowed: "#00F000",  // 緑色 (許可された)
};