import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAndAddNewUsers } from "../../redux/actions/user/fetchedUserActions";
import { useAppSelector } from "../../redux/hooks";
import { revertTimestampConversion } from "../../functions/db/dataFormatUtils";
import { DocumentIdMap } from "../../types/firebase/db/formatTypes";
import { UserData } from "../../types/firebase/db/user/userStructure";

export const useUserMap = (userIds: string[]) => {
  const [userMap, setUserMap] = useState<DocumentIdMap<UserData>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const usersFromStore = useAppSelector(state => state.fetchedUserSlice.users);

  useEffect(() => {
    const fetchUsers = async () => {
      if (userIds.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        await fetchAndAddNewUsers(dispatch, userIds);
      } catch (err) {
        console.error("Error fetching users: ", err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userIds, dispatch]);

  useEffect(() => {
    if (usersFromStore) {
      const convertedUsers = revertTimestampConversion(usersFromStore) as DocumentIdMap<UserData>;
      setUserMap(convertedUsers);
    }
  }, [usersFromStore]);

  return { userMap, loading, error };
};
