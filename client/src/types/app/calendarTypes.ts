import { ISODate } from "../util/dateTimeTypes";
import { HexColorCode } from "../util/utilTypes";

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date | ISODate;
    end?: Date | ISODate;
    allDay?: boolean;
    url?: string;
    className?: string | string[];
    editable?: boolean;
    color?: HexColorCode;
    backgroundColor?: string;
    borderColor?: HexColorCode;
    textColor?: HexColorCode;
    extendedProps?: Record<string, any>;
}

export type SpecialDays = Record<ISODate, {
    color?: HexColorCode;
    tooltip?: string;
    textColor?: HexColorCode;
    borderColor?: HexColorCode;
    backgroundColor?: HexColorCode;
}>;
