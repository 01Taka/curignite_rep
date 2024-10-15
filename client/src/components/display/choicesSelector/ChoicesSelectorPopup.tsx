import React from 'react';
import Popup from '../popup/Popup';
import ChoicesSelector from './ChoicesSelector';
import { ChoicesSelectorProps } from './choicesSelectorTypes';

interface ChoicesSelectorPopupProps extends ChoicesSelectorProps {
  open: boolean;
  handleClose: () => void;
}

const ChoicesSelectorPopup: React.FC<ChoicesSelectorPopupProps> = ({
  open,
  handleClose,
  choicesItems,
  bgcolor,
  imageShape,
  containerHeight,
  onClickChoices
}) => {
  return (
    <Popup open={open} handleClose={handleClose} fixationCloseButton >
      <ChoicesSelector
        choicesItems={choicesItems}
        bgcolor={bgcolor}
        imageShape={imageShape}
        containerHeight={containerHeight}
        onClickChoices={onClickChoices}
      />
    </Popup>
  );
};

export default ChoicesSelectorPopup;