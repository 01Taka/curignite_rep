import { ComponentColor } from "../../types/module/tailwindTypes";
import { StringNumber } from "../../types/util/utilTypes";


// グラデーションカラーの定義
export const dueDateColors: Record<StringNumber | "~over", ComponentColor> = {
  "~over": { bgColor: 'bg-purple-900', textColor: 'text-white' }, // 過ぎた
  "0": { bgColor: 'bg-red-700', textColor: 'text-white', borderColor: "border-red-900" },
  "1": { bgColor: 'bg-red-500', textColor: 'text-white' },
  "2": { bgColor: 'bg-orange-500', textColor: 'text-black' },
  "5": { bgColor: 'bg-orange-300', textColor: 'text-black' },
  "8": { bgColor: 'bg-purple-400', textColor: 'text-black' },
  "11": { bgColor: 'bg-purple-300', textColor: 'text-black' },
  "15": { bgColor: 'bg-blue-400', textColor: 'text-black' },
  "22": { bgColor: 'bg-blue-300', textColor: 'text-black' },
  "29": { bgColor: 'bg-blue-100', textColor: 'text-black' },
};

export const progressColors: Record<number, ComponentColor> = {
  1: { bgColor: 'bg-green-500', textColor: 'text-black' }, 
  0.99: { bgColor: 'bg-blue-400', textColor: 'text-black' }, // 100%
  0.75: { bgColor: 'bg-purple-300', textColor: 'text-black' }, // 75%
  0.5: { bgColor: 'bg-orange-300', textColor: 'text-black' }, // 50%
  0.25: { bgColor: 'bg-orange-400', textColor: 'text-black' }, // 25%
};
