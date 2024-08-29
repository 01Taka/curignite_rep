import { SelectChangeEvent } from "@mui/material";
import { ReactNode } from "react";
import { BGColorClass } from "../module/tailwindTypes";

export type HTMLElement<T, K extends string> = {
    name: string;
    value: T,
    type: K;
}

export type HTMLDateElement = HTMLElement<Date | null, "date">;
export type HTMLRangeElement = HTMLElement<Range[], "range">;
export type HTMLFileElement = HTMLElement<File, "file">;

type CustomHTMLElement = HTMLDateElement | HTMLRangeElement | HTMLFileElement;

export type FormStateChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | CustomHTMLElement>;

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

export interface HeatmapCellColor {
    borderCount: number;
    colorClass: BGColorClass;
}

export interface Range {
    min: number;
    max: number;
}