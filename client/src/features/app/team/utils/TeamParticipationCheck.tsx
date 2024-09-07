import { FC, useEffect, useState } from "react";
import { BaseParticipationStatus } from "../../../../types/firebase/db/baseTypes";
import serviceFactory from "../../../../firebase/db/factory";
import { CircularProgress } from "@mui/material";
import AccessStateErrorMessage from "../../../utils/messages/AccessStateErrorMessage";

interface TeamParticipationCheckProps {
  uid: string | null;
  teamId: string | null;
  children: React.ReactNode;
}

const TeamParticipationCheck: FC<TeamParticipationCheckProps> = ({ uid, teamId, children }) => {
  const [participationStatus, setParticipationStatus] = useState<BaseParticipationStatus | "loading">("loading");

  useEffect(() => {
    const updateParticipationStatus = async () => {
      if (uid && teamId) {
        const teamService = serviceFactory.createTeamService();
        const state = await teamService.getParticipationStatus(teamId, uid);
        setParticipationStatus(state);
      }
    };
    updateParticipationStatus();
  }, [uid, teamId]);

  const isValidParticipationStatus = (status: BaseParticipationStatus): boolean => {
    return [BaseParticipationStatus.Active, BaseParticipationStatus.Declined].includes(status);
  };

  if (participationStatus === "loading") {
    return <CircularProgress />;
  }

  return isValidParticipationStatus(participationStatus) ? (
    <>{children}</>
  ) : (
    <AccessStateErrorMessage message='このチームへのアクセスは許可されていません。'/>
  );
};

export default TeamParticipationCheck;
