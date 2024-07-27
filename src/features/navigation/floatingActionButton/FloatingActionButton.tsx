import { useState } from "react";
import CircularButton from "../../../components/input/button/CircularButton";
import { cn } from "../../../functions/utils";
import { FloatingActionButtonProps } from "../../../types/app/navigationTypes";

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ icon, elements, action }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    action && action(event);
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-16 right-16 flex flex-col items-end">
      {elements && elements.map((item, index) => (
        <div
          key={index}
          className={cn(
            "transition-transform duration-300  mt-2",
            isOpen ? "translate-x-0" : "translate-x-96",
          )}
          style={{ transitionDelay: `${(elements.length - index) * 50}ms` }}
        >
          <CircularButton onClick={item.action} bgColor="main" size="xs">
            {item.icon}
          </CircularButton>
        </div>
      ))}
      <CircularButton onClick={handleToggle} bgColor="accent" size="xs" className="mt-2">
        {icon}
      </CircularButton>
    </div>
  );
};

export default FloatingActionButton;
