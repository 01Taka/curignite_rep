import { ISODate } from "../util/dateTimeTypes";

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date | ISODate;
    end?: Date | ISODate;
    allDay?: boolean;
    url?: string;
    className?: string | string[];
    editable?: boolean;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    extendedProps?: Record<string, any>;
}

export type SpecialDays = Record<ISODate, {
    color?: string;
    tooltip?: string;
    textColor?: string;
    borderColor?: string;
    backgroundColor?: string;
}>;
