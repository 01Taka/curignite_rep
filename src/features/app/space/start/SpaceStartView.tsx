import React, { FC } from 'react';
import { SpaceStartActionsViewProps, SpacesProps } from '../../../../types/app/spaceTypes'
import Spaces from '../spaces/Spaces';
import SpaceStartActionsView from './SpaceStartActionsView';
import FormContainer from '../../../../components/container/FormContainer';

const SpaceStartView: FC<SpaceStartActionsViewProps & SpacesProps> = ({ toSetting, onStart, spaces }) => {
  return (
    <FormContainer flexCenter>
      <SpaceStartActionsView toSetting={toSetting} onStart={onStart}/>
      <Spaces spaces={spaces} />
    </FormContainer>
  );
}

export default SpaceStartView;
