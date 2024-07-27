import { FC } from "react";

const SpacesEmptyMessage: FC = () => {
    return (
      <div className='flex justify-center items-center w-full p-4 mt-8'>
        <div className='w-full max-w-md h-auto border-4 border-secondaryBase rounded-lg p-6 flex items-center justify-center'>
          <p className='text-lg text-center'>
            他のメンバーが学習を始めると<br/>
            ここにメンバーの学習スペースが表示されます！
          </p>
        </div>
      </div>
    );
}

export default SpacesEmptyMessage