import React, { FC, useEffect, useState } from 'react';
import SpaceHomeView from '../../../../features/app/space/home/SpaceHomeView';
import { useAppSelector } from '../../../../redux/hooks';
import { SpaceData } from '../../../../types/firebase/db/space/spacesTypes';
import { revertTimestampConversion } from '../../../../functions/db/dbUtils';
import { getSpaceFromStorage } from '../../../../functions/app/space/spaceDBUtils';

const SpaceHome: FC = () => {
  const [space, setSpace] = useState<SpaceData | null>(null);

  const { currentSpace } = useAppSelector(state => state.spaceSlice);

  useEffect(() => {
    const updateSpace = async () => {
      try {
        if (currentSpace) {
          const data: SpaceData = revertTimestampConversion(currentSpace);
          setSpace(data);
        } else {
          const spaceData = await getSpaceFromStorage();
          setSpace(spaceData);
        }
      } catch (error) {
        console.error("Failed to update space:", error);
      }
    };

    updateSpace();
  }, [currentSpace]);

  return (
    <>
      {space ? (
        <SpaceHomeView space={space} />
      ) : (
        <div>Loading...</div> // または別のローディング状態表示
      )}
    </>
  );
};

export default SpaceHome;
