import { AvatarVariant } from "../../../types/module/mui/muiTypes";
import { Image } from "../../../types/util/componentsTypes";
import { HexColorCode } from "../../../types/util/utilTypes";

export interface ChoicesItem<T = number> {
  id: T;
  title: string;
  contents?: string;
  image?: Image;
}

export interface ChoicesSelectorProps<T = number> {
  choicesItems: ChoicesItem<T>[];
  bgcolor?: HexColorCode;
  containerHeight?: number;
  imageShape?: AvatarVariant;
  imageMaxWidth?: number | string;
  onClickChoices: (id: T) => void;
}