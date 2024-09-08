import { useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { DocumentIdMap } from "../../types/firebase/db/formatTypes";
import { UserWithSupplementary } from "../../types/firebase/db/user/userStructure";
import { fetchAndSetUsers } from "../../redux/actions/user/fetchedUserActions";

export const useUserMap = (userIds: string[]) => {
  const [userMap, setUserMap] = useState<DocumentIdMap<UserWithSupplementary>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const memoizedUserIds = useMemo(() => userIds, [userIds.join(',')]);

  useEffect(() => {
    const fetchUsers = async () => {
      setError(null);

      if (userIds.length === 0 || loading) return;

      setLoading(true);

      try {
        const userMap = await fetchAndSetUsers(dispatch, userIds);
        setUserMap(userMap);
      } catch (err) {
        console.error("Error fetching users: ", err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [memoizedUserIds, dispatch]);

  return { userMap, loading, error };
};
