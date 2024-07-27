import { PublicationTarget, SpaceData } from "../firebase/db/spacesTypes";
import { FormStateChangeEvent } from "../util/componentsTypes";

export interface SpaceStartFormState {
  spaceName: string;
  introduction: string;
  publicationTarget: PublicationTarget;
  requiredApproval: boolean;
}

export const initialSpaceStartFormState: SpaceStartFormState = {
  spaceName: "",
  introduction: "",
  publicationTarget: "team",
  requiredApproval: true,
}

export interface SpacesProps {
  spaces: SpaceData[];
}

export interface SpaceStartActionsViewProps {
  toSetting: () => void;
  onCreateSpace: () => void;
}

export interface SpaceSettingViewProps {
  formState: SpaceStartFormState;
  onChangeFormState: (event: FormStateChangeEvent) => void;
  onCompletion: () => void;
}
