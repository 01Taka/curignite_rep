import { TimeTypes } from "../../../types/util/dateTimeTypes";
import { convertToMilliseconds } from "../../utils/dateTimeUtils";

/**
 * 時間をストレージに保存するための形式に変換します。
 */
export const convertTimeForStorage = (dateTime: TimeTypes): string => convertToMilliseconds(dateTime).toString();
