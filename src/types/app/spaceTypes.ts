import { SpaceData, SpacePublicationTarget } from "../firebase/db/space/spacesTypes";
import { FormStateChangeEvent } from "../util/componentsTypes";

export interface SpaceStartFormState {
  spaceName: string;
  description: string;
  publicationTarget: SpacePublicationTarget;
  requiredApproval: boolean;
}

export const initialSpaceStartFormState: SpaceStartFormState = {
  spaceName: "",
  description: "",
  publicationTarget: SpacePublicationTarget.Team,
  requiredApproval: true,
}

export interface SpacesProps {
  spaces: SpaceData[];
}

export interface SpaceStartActionsViewProps {
  toSetting: () => void;
  onStart: () => void;
}

export interface SpaceSettingViewProps {
  formState: SpaceStartFormState;
  onChangeFormState: (event: FormStateChangeEvent) => void;
  onCompletion: () => void;
  onUpdateDefaultSetting: () => void;
}
