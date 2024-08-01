import React, { FC, useEffect, useState } from 'react'
import SpaceHomeView from '../../../../features/app/space/home/SpaceHomeView'
import { useAppSelector } from '../../../../redux/hooks'
import { SpaceData } from '../../../../types/firebase/db/spacesTypes'
import { toTimestamp } from '../../../../functions/dateTimeUtils'
import { getSpaceFromStorage } from '../../../../features/app/space/spaceUtils'

const SpaceHome: FC = () => {
  const [space, setSpace] = useState<SpaceData | null>(null);

  const { currentSpace } = useAppSelector(state => state.spaceSlice);

  useEffect(() => {
    const updateSpace = async () => {
      if (currentSpace) {
        const data: SpaceData = {
          ...currentSpace,
          createdAt: toTimestamp(currentSpace.createdAtMillis),
        }
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