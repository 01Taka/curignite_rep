import { SelectChangeEvent } from "@mui/material";
import { ReactNode } from "react";

export type FormStateChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

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