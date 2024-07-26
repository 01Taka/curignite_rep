import React, { FC } from 'react';
import CircularButton from '../../../components/input/button/CircularButton';
import { routeElement } from '../routes/mainItems';

interface HomeViewProps {
  radius: number;
  routeElements: routeElement[];
  centerItem?: routeElement;
  angleAdjustment?: number;
  onNavigate: (path: string) => void;
}


const HomeView: FC<HomeViewProps> = ({ radius, routeElements, centerItem, angleAdjustment = 0, onNavigate }) => {
  const angle = 360 / routeElements.length;
  const buttonSize = 128; // CircularButtonのサイズ (px)
  const centerButtonSize = 192; // 中心のCircularButtonのサイズ (px)

  return (
    <div className='flex justify-center items-center w-auto h-full'>
      <div style={{ position: 'relative', width: `${2 * radius + buttonSize}px`, height: `${2 * radius + buttonSize}px` }}>
        {centerItem && (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-${centerButtonSize / 2}px, -${centerButtonSize / 2}px)`
          }}>
            <CircularButton
              children={centerItem.text}
              size='x8l'
              bgColor='main'
              invalidation={centerItem.invalidation}
              onClick={() => onNavigate(centerItem.path)}
            />
          </div>
        )}

        {routeElements.map((route, index) => {
          const theta = ((angle * index) + angleAdjustment) * (Math.PI / 180);
          const x = (radius + radius * Math.cos(theta)) + (buttonSize / 2);
          const y = (radius + radius * Math.sin(theta)) + (buttonSize / 2);

          return (
            <div key={index} style={{ position: 'absolute', left: `${x}px`, top: `${y}px`, transform: `translate(-${buttonSize / 2}px, -${buttonSize / 2}px)` }}>
              <CircularButton
                children={route.text}
                size='x4l'
                bgColor='secondaryBase'
                invalidation={route.invalidation}
                onClick={() => onNavigate(route.path)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomeView;
