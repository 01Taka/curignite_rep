import React, { FC } from 'react'
import { SpaceData } from '../../../../types/firebase/db/spacesTypes'

export interface SpacesProps {
  spaces: SpaceData[];
}

const Spaces: FC<SpacesProps> = () => {
  return (
    <div>スペースのリストを表示するコンポーネント</div>
  )
}

export default Spaces