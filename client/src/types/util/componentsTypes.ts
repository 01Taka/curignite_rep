import { SelectChangeEvent } from "@mui/material";
import { ReactNode } from "react";

export type FormStateChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

export type FormStateChangeFunc = (e: FormStateChangeEvent) => void;

export type SelectFieldChange = (event: SelectChangeEvent<string | number>, child: ReactNode) => void;

export interface SelectItem<T> {
    label: string;
    value: T;
}

export interface ActionButton {
    icon: ReactNode;
    text: string;
    action: () => void;
}

export type StringBoolean = "true" | "false";

export type DecimalDigits = 0 | 1 | 2 | 3 | 4;

export type TimerSize = "sm" | "md" | "lg" | "xl";

export interface TimeUseState {
    time: number;
    setTime: React.Dispatch<React.SetStateAction<number>>;
}

export interface ActiveUseState {
    active: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Pomodoro {
    cycle: number;
    break: number;
}
  
  