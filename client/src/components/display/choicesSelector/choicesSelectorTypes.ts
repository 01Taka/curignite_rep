import { AvatarVariant } from "../../../types/module/mui/muiTypes";
import { HexColorCode } from "../../../types/util/utilTypes";

export interface ChoicesImageSetting {
  src: string;
  alt?: string;
}

export interface ChoicesItem<T = number> {
  id: T;
  title: string;
  contents?: string;
  imageSetting?: ChoicesImageSetting;
}

export interface ChoicesSelectorProps<T = number> {
  choicesItems: ChoicesItem<T>[];
  bgcolor?: HexColorCode;
  containerHeight?: number;
  imageShape?: AvatarVariant;
  imageMaxWidth?: number | string;
  onClickChoices: (id: T) => void;
}