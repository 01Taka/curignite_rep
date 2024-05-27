import React, { useState, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { increment, decrement, set } from '../redux/sampleCounterSlice';

const SampleCounterComponent: React.FC = () => {
  const count = useSelector((state: RootState) => state.sampleCounter.value);
  const dispatch = useDispatch<AppDispatch>();

  const [currentInput, setCurrentInput] = useState<number>(10);

  const handleIncrement = () => {
    dispatch(increment());
  };

  const handleDecrement = () => {
    dispatch(decrement());
  };

  const handleSetToInput = () => {
    dispatch(set(currentInput));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(event.target.value, 10);
    if (!isNaN(inputValue)) {
      setCurrentInput(inputValue);
    }
  };

  return (
    <div>
      <h1 className='text-4xl font-bold'>Redux Counter</h1>
      <p className='text-xl'>Count: {count}</p>
      <div className='flex'>
        <button onClick={handleIncrement} className='p-1 m-1 border-2'>Increment</button>
        <button onClick={handleDecrement} className='p-1 m-1 border-2'>Decrement</button>
        <div className='flex p-1 m-1 border-2'>
          <button onClick={handleSetToInput} className='p-1 m-1 border-2'>Set to Input</button>
          <input
            type="number"
            value={currentInput}
            onChange={handleInputChange}
            className='m-1 border-2'
          />
        </div>
      </div>
    </div>
  );
};

export default SampleCounterComponent;
