import { Typography } from '@mui/material';
import React, { FC, ReactNode } from 'react';
import { cn } from '../../../../../../functions/utils';
import { StringField } from '../../../../../../components/input/inputIndex';
import CircularButton from '../../../../../../components/input/button/CircularButton';

interface ActionContainerProps {
    heading: string;
    icon: ReactNode;
    explanation: string;
    label: string;
    value: string;
    enterText: string;
    onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onEnter: () => void;
}

const ActionContainer: FC<ActionContainerProps> = ({
    heading,
    icon,
    explanation,
    label,
    value,
    enterText,
    onValueChange,
    onEnter,
}) => {
    const classes = cn('flex flex-col items-center w-94 p-8 rounded-lg border-gray-400 hover:border-main border-4', !!value && 'border-main')
    return (
        <div className={classes}> 
            <div className='flex items-end'>
                <Typography variant="h4">
                    {heading}
                </Typography>
                <div className='ml-2' />
                <Typography variant="h3">
                    {icon}
                </Typography>
            </div>
            
            <Typography variant="body1" className="text-grayText pt-4 pb-1">
                {explanation}
            </Typography>
            <form className="flex items-center w-11/12">
                <StringField value={value} label={label} onChange={onValueChange} />
                <CircularButton
                    onClick={onEnter} 
                    size="md"
                    bgColor="main" 
                    invalidation={!value} 
                    className="ml-2"
                >
                    {enterText}
                </CircularButton>
            </form>
        </div>
    );
}

export default ActionContainer;
