import React, { FC, useEffect, useState } from 'react';
import SpaceHomeView from '../../../../features/app/space/home/SpaceHomeView';
import { useAppSelector } from '../../../../redux/hooks';
import { getSpaceFromStorage } from '../../../../functions/app/space/spaceDBUtils';
import { SpaceData } from '../../../../types/firebase/db/space/spacesTypes';
import { useParams } from 'react-router-dom';
import { PathParam } from '../../../../types/path/paths';
import { revertTimestampConversion } from '../../../../functions/db/dataFormatUtils';

const SpaceHome: FC = () => {
  const params = useParams();
  const spaceId = params[PathParam.SpaceId];
  
  const [space, setSpace] = useState<SpaceData | null>(null);

  const { spaces, currentSpaceId } = useAppSelector(state => state.spaceSlice);
  const currentSpace = spaces[currentSpaceId];

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
