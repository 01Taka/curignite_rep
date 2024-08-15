export type TailwindSize =
 | 'xs' | 'sm' | 'base' | 'lg' 
 | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl'

 export type WidthValueClasses = 
 | 'w-0' | 'w-1' | 'w-2' | 'w-3' | 'w-4' | 'w-5' | 'w-6' | 'w-7' | 'w-8' | 'w-9' | 'w-10'
 | 'w-11' | 'w-12' | 'w-16' | 'w-20' | 'w-24' | 'w-28' | 'w-32' | 'w-36' | 'w-40'
 | 'w-44' | 'w-48' | 'w-52' | 'w-56' | 'w-60' | 'w-64' | 'w-72' | 'w-80' | 'w-96'
 | 'w-1/2' | 'w-1/3' | 'w-2/3' | 'w-1/4' | 'w-2/4' | 'w-3/4' | 'w-1/5' | 'w-2/5' | 'w-3/5' | 'w-4/5' | 'w-full';
 
 export type HeightValueClasses = 
 | 'h-0' | 'h-1' | 'h-2' | 'h-3' | 'h-4' | 'h-5' | 'h-6' | 'h-7' | 'h-8' | 'h-9' | 'h-10'
 | 'h-11' | 'h-12' | 'h-16' | 'h-20' | 'h-24' | 'h-28' | 'h-32' | 'h-36' | 'h-40'
 | 'h-44' | 'h-48' | 'h-52' | 'h-56' | 'h-60' | 'h-64' | 'h-72' | 'h-80' | 'h-96'
 | 'h-1/2' | 'h-1/3' | 'h-2/3' | 'h-1/4' | 'h-2/4' | 'h-3/4' | 'h-1/5' | 'h-2/5' | 'h-3/5' | 'h-4/5' | 'h-full';
 
 export type WidthClasses = 
 WidthValueClasses | 'w-auto' | 'w-screen' | 'w-min' | 'w-max' | 'w-fit';
 
 export type HeightClasses = 
 HeightValueClasses | 'h-auto' | 'h-screen' | 'h-min' | 'h-max' | 'h-fit';
 
 type CustomColor = "";
 type TailwindColor = 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'pink' | 'gray' | CustomColor;
 type TailwindShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
 
 type TailwindColorClass = `bg-${TailwindColor}-${TailwindShade}` | `bg-${CustomColor}`;
 export type BGColorClass = TailwindColorClass | 'bg-transparent' | 'bg-white' | 'bg-black' | null | undefined;
 