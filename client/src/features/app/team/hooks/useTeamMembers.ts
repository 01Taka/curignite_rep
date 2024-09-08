import { useState, useEffect } from 'react';
import serviceFactory from '../../../../firebase/db/factory';
import { TeamMemberData } from '../../../../types/firebase/db/team/teamStructure';

export const useTeamMembers = (teamId: string | null) => {
  const [members, setMembers] = useState<TeamMemberData[]>([]);
  const [membersId, setMembersId] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!teamId) return;
      
      setLoading(true);
      setError(null);

      try {
        const memberService = serviceFactory.createTeamMemberService();
        const fetchedMembers = await memberService.getAllMembers(teamId);
        setMembers(fetchedMembers);
        setMembersId(fetchedMembers.map(member => member.docId));
      } catch (err) {
        console.error("Failed to fetch team members:", err);
        setError("Failed to fetch team members.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [teamId]);

  return { members, membersId, loading, error };
};
