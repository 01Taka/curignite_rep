import { Menu } from '@mui/icons-material';
import React, { FC, ReactNode } from 'react';
import CircularButton from '../../../components/input/button/CircularButton';
import { cva } from 'class-variance-authority';

interface SideListViewProps {
  children: ReactNode;
  width: number;
  isOpen: boolean;
  fullScreenOnMobile: boolean;
  toggleSideList: () => void;
}

const sideListVariants = cva("",
  {
    variants: {
      type: {

      }
    }
  }
)

const SideListView: FC<SideListViewProps> = ({ children, width, isOpen, fullScreenOnMobile, toggleSideList }) => {
  return (
    <>
      {!isOpen &&
          <CircularButton children={<Menu />} size="xs" onClick={toggleSideList} bgColor="main" textColor="black" className='md:hidden fixed top-0 left-0 ml-2 mt-14 bg-opacity-50 hover:bg-opacity-50'/>
      }
      <div
        className={`fixed top-0 border-2 z-10 transition-transform duration-300 h-full mt-12 ${
          isOpen ? 'transform translate-x-0' : 'transform -translate-x-full md:translate-x-0 md:ml-16'
        } ${fullScreenOnMobile ? 'w-full md:w-auto' : ''}`}
        style={{ width: fullScreenOnMobile ? 'w-full' : `${width}px` }}
      >
        <div className="md:hidden absolute top-4 right-4">
          <button onClick={toggleSideList}>
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className='bg-secondaryBase h-full'>
        {children}
        </div>
    </div>
    </>
  );
};

export default SideListView;
