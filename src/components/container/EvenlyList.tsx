import React, { FC, ReactNode } from 'react';

interface EvenlyListProps {
  betweenElement: ReactNode;
  elements: ReactNode[];
}

const EvenlyList: FC<EvenlyListProps> = ({ betweenElement, elements }) => {
  return (
    <div className="flex flex-col">
      {elements.map((element, index) => (
        <div key={index} className="flex flex-col">
          {element}
          {index !== elements.length - 1 && (
            <div className="mx-2">{betweenElement}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EvenlyList;
