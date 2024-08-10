import React, { FC } from 'react';
import Spaces from '../spaces/Spaces';
import SpaceStartActionsView from './SpaceStartActionsView';
import FormContainer from '../../../../components/container/FormContainer';
import { SpacesProps, SpaceStartActionsViewProps } from '../../../../types/app/space/spaceTypes';

const SpaceStartView: FC<SpaceStartActionsViewProps & SpacesProps> = ({ spaces, isStarting, toSetting, onStart, onSpaceClick }) => {
  return (
    <FormContainer flexCenter>
      <SpaceStartActionsView isStarting={isStarting} toSetting={toSetting} onStart={onStart}/>
      <Spaces spaces={spaces} onSpaceClick={onSpaceClick}/>
    </FormContainer>
  );
}

export default SpaceStartView;
