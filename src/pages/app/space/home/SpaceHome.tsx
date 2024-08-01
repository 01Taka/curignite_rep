import React, { FC, useEffect, useState } from 'react'
import SpaceHomeView from '../../../../features/app/space/home/SpaceHomeView'
import { useAppSelector } from '../../../../redux/hooks'
import { getSpaceFromStorage } from '../../../../features/app/space/spaceUtils'
import { SpaceData } from '../../../../types/firebase/db/space/spacesTypes'
import { revertTimestampConversion } from '../../../../functions/db/dbUtils'

const SpaceHome: FC = () => {
  const [space, setSpace] = useState<SpaceData| null>(null);

  const { currentSpace } = useAppSelector(state => state.spaceSlice);

  useEffect(() => {
    const updateSpace = async () => {
      if (currentSpace) {
        const data: SpaceData = revertTimestampConversion(currentSpace);
        setSpace(data);
      } else {
        const space = await getSpaceFromStorage();
        setSpace(space);
      }
    }

    updateSpace();
  }, [currentSpace])

  return <SpaceHomeView 
    space={space}
  />
}

export default SpaceHome