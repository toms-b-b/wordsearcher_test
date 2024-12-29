import { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2'
};

const arrowClasses = {
  top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-gray-700 border-l-transparent border-r-transparent border-b-transparent',
  right: 'left-[-6px] top-1/2 -translate-y-1/2 border-r-gray-700 border-t-transparent border-b-transparent border-l-transparent',
  bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-b-gray-700 border-l-transparent border-r-transparent border-t-transparent',
  left: 'right-[-6px] top-1/2 -translate-y-1/2 border-l-gray-700 border-t-transparent border-b-transparent border-r-transparent'
};

export function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className={`
        invisible group-hover:visible opacity-0 group-hover:opacity-100
        absolute z-50 transition-all duration-200 ease-in-out
        ${positionClasses[position]}
      `}>
        <div className="relative">
          <div className="bg-gray-700 text-white text-xs rounded py-1 px-2 min-w-[150px] max-w-[300px] text-center whitespace-normal">
            {content}
          </div>
          <div className={`
            absolute w-0 h-0
            border-4
            ${arrowClasses[position]}
          `} />
        </div>
      </div>
    </div>
  );
}
