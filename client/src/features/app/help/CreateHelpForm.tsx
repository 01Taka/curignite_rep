import React, { FC, useState } from 'react'
import serviceFactory from '../../../firebase/db/factory'
import { Subject } from '../../../types/firebase/db/common/commonTypes';
import { useAppSelector } from '../../../redux/hooks';
import { StringField } from '../../../components/input/inputIndex';
import { keyMirror } from '../../../functions/objectUtils';
import SelectField from '../../../components/input/field/SelectField';
import { handleFormStateChange } from '../../../functions/utils';
import { FormStateChangeEvent } from '../../../types/util/componentsTypes';
import { subjectSelectItems } from '../../../constants/selectItems/subjectSelectItems';
import FileUploadField from '../../../components/input/field/FileUploadField';
import CircularButton from '../../../components/input/button/CircularButton';

interface HelpFromState {
  question: string;
  subject: Subject;
  files: File[];
}

const CreateHelpForm: FC = () => {
  const uid = useAppSelector(state => state.userSlice.uid);

  const [fromState, setFromState] = useState<HelpFromState>({
    question: "",
    subject: Subject.NotSelected,
    files: [],
  })

  const names = keyMirror(fromState);

  const handleCreateHelp = async () => {
    if (uid) {
      const helpService = serviceFactory.createUserHelpService();
      await helpService.createUserHelp(uid, fromState.subject, fromState.question, fromState.files);
    }
  }

  const onFormStateChange = (event: FormStateChangeEvent) => {
    handleFormStateChange(event, setFromState);
  }

  return (
    <div>
      <StringField label='質問内容' value={fromState.question} name={names.question} onChange={onFormStateChange} />
      <SelectField label='教科' value={fromState.subject} name={names.subject} onChange={onFormStateChange} selectItems={subjectSelectItems}/>
      <FileUploadField label='ファイル' value={fromState.files} name={names.files} onChange={onFormStateChange} />
      <CircularButton bgColor="main" onClick={handleCreateHelp}>
        ヘルプを<br />求める
      </CircularButton>
    </div>
  )
}

export default CreateHelpForm