import { FC, useEffect, useState } from "react";
import { Card, Tabs, Tab } from "@mui/material";
import Members from "./Members";
import JoinRequests from "./JoinRequests";
import { JoinRequestData } from "../../../../../../types/firebase/db/common/joinRequest/joinRequestStructure";
import { SpaceMemberData } from "../../../../../../types/firebase/db/space/spaceStructure";
import { useUserMap } from "../../../../../hooks/useUserMap";

interface ParticipantsProps {
  members: SpaceMemberData[];
  joinRequests: JoinRequestData[];
}

const Participants: FC<ParticipantsProps> = ({ members, joinRequests }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const userMap = useUserMap([
    ...members.map(member => member.docId),
    ...joinRequests.map(request => request.docId)
  ]).userMap;

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div className="p-4 w-80 h-full">
      <Tabs value={tabIndex} onChange={handleTabChange} className="mb-4">
        <Tab label="Members" />
        <Tab label="Join Requests" />
      </Tabs>
      <Card className="h-full p-4 rounded-lg bg-gray-50 overflow-y-auto">
        {tabIndex === 0 && (
          <Members members={members} userMap={userMap} />
        )}
        {tabIndex === 1 && (
          <JoinRequests joinRequests={joinRequests} userMap={userMap} activeMembersId={members.map(member => member.docId)} />
        )}
      </Card>
    </div>
  );
};

export default Participants;
