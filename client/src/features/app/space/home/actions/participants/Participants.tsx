import { FC, useState } from "react";
import { ActionInfo, Member } from "../../../../../../types/firebase/db/baseTypes";
import { SpaceActionTypes } from "../../../../../../types/firebase/db/space/spaceStructure";
import { Card, CardContent, Tabs, Tab } from "@mui/material";
import { UserData } from "../../../../../../types/firebase/db/user/usersTypes";
import { DocumentIdMap } from "../../../../../../types/firebase/db/formatTypes";
import Members from "./Members";
import JoinRequests from "./JoinRequests";

interface ParticipantsProps {
  members: Member[];
  awayMembers: Member[];
  joinRequests: ActionInfo<SpaceActionTypes>[];
  userMap: DocumentIdMap<UserData>;
}

const Participants: FC<ParticipantsProps> = ({ members, awayMembers, joinRequests, userMap }) => {
  const [tabIndex, setTabIndex] = useState(0);

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
          <Members members={members} awayMembers={awayMembers} userMap={userMap} />
        )}
        {tabIndex === 1 && (
          <JoinRequests joinRequests={joinRequests} userMap={userMap} />
        )}
      </Card>
    </div>
  );
};

export default Participants;
