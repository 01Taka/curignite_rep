import React, { FC } from 'react';
import CircularButton from '../../../../components/input/button/CircularButton';
import Heading from '../../../../components/container/Heading';
import { StringField } from '../../../../components/input/inputIndex';
import MultilineField from '../../../../components/input/field/MultilineField';
import EvenlyList from '../../../../components/container/EvenlyList';
import FormContainer from '../../../../components/container/FormContainer';

interface SpaceSettingViewProps {}

const SpaceSettingView: FC<SpaceSettingViewProps> = () => {
  return (
    <FormContainer flexCenter>
      <ActionButtons />
      <SectionDivider />
      <SettingHeading />
      <SpaceSettingForm />
      <BottomSpacer />
    </FormContainer>
  );
};

const ActionButtons: FC = () => (
  <div className="flex justify-center items-end my-8">
    <CircularButton looks="frame" size="md" bgColor="main">
      スペース<br />に参加
    </CircularButton>
    <div className="px-4" />
    <CircularButton size="lg" bgColor="main">
      勉強を<br />はじめる
    </CircularButton>
  </div>
);

const SectionDivider: FC = () => (
  <div className="w-11/12 border-main border-b-2 mb-6" />
);

const SettingHeading: FC = () => (
  <div>
    <Heading level={2}>学習スペースの設定</Heading>
    <p className="mt-2 text-lg text-grayText">
      「勉強をはじめる」ときに作られる
      <br />
      あなたの勉強スペースの設定です。
    </p>
  </div>
);

const SpaceSettingForm: FC = () => (
  <form className="flex flex-col my-8 w-11/12">
    <EvenlyList
      elements={[
        <StringField key="spaceName" value="" label="スペース名" onChange={() => {}} />,
        <MultilineField key="themeDescription" value="" rows={5} label="テーマの説明" onChange={() => {}} />,
      ]}
      betweenElement={<div className="my-4" />}
    />
  </form>
);

const BottomSpacer: FC = () => <div className="my-64" />;

export default SpaceSettingView;
