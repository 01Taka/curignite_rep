import React, { FC } from 'react';
import { SpaceStartActionsViewProps, SpacesProps } from '../../../../types/app/spaceTypes'
import Spaces from '../spaces/Spaces';
import SpaceStartActionsView from './SpaceStartActionsView';

const SpaceStartView: FC<SpaceStartActionsViewProps & SpacesProps> = ({ toSetting, onCreateSpace, spaces }) => {
  return (
    <>
      <SpaceStartActionsView toSetting={toSetting} onCreateSpace={onCreateSpace}/>
      <Spaces spaces={spaces} />
    </>
  );
}

export default SpaceStartView;
