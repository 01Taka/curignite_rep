import { useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import { DocumentIdMap } from '../../../../types/firebase/db/formatTypes';
import { UserWithSupplementary } from '../../../../types/firebase/db/user/userStructure';
import serviceFactory from '../../../../firebase/db/factory';
import { useUserMap } from '../../../hooks/useUserMap';


// アクティブメンバーを取得するためのカスタムフック
const useActiveMembers = () => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const [sameTeamMembersId, setSameTeamMembersId] = useState<string[]>([]);
  const [activeMemberMap, setActiveMemberMap] = useState<DocumentIdMap<UserWithSupplementary>>({});

  // 同じチームのメンバーIDを取得する
  const updateSameTeamMembersId = useCallback(async () => {
    if (uid) {
      const teamService = serviceFactory.createTeamMemberService();
      const membersId = await teamService.getSameTeamMembersId(uid);
      setSameTeamMembersId(membersId);
    }
  }, [uid]);

  // TODO データのリアルタイム性が必要なのでReduxから取得ではなくデータをDBから取得して使用するかReduxのメンバーの自動更新を行うように変更する
  // メンバーIDからユーザーデータを取得するフックを使用
  const { userMap, loading, error } = useUserMap(sameTeamMembersId);

  // ユーザーマップからアクティブなメンバーをフィルタリング
  useEffect(() => {
    const activeMembers: DocumentIdMap<UserWithSupplementary> = {};
    Object.keys(userMap).forEach((key) => {
      const user = userMap[key];
      if (user?.isLearning) {
        activeMembers[key] = user;
      }
    });
    setActiveMemberMap(activeMembers);
  }, [userMap]);

  // フックから取得するデータ
  return { activeMemberMap, loading, error, updateSameTeamMembersId };
};

export default useActiveMembers;
