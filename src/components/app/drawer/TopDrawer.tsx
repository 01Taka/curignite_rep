import { ReactNode } from "react";

interface TopDrawerProps {
    startItems?: ReactNode[];
    endItems?: ReactNode[];
}

const TopDrawer: React.FC<TopDrawerProps> = ({ startItems, endItems }) => (
    <div className='fixed top-0 left-0 flex justify-between items-center w-full h-12 bg-main px-6'>
      <div className="flex space-x-4">
        {startItems?.map((item, index) => (
          <div key={index}>
            {item}
          </div>
        ))}
      </div>
      <div className="flex space-x-4">
        {endItems?.map((item, index) => (
          <div key={index}>
            {item}
          </div>
        ))}
      </div>
    </div>
);

export default TopDrawer;
