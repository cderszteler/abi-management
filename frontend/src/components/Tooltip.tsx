import {CustomFlowbiteTheme, Tooltip as FlowbiteTooltip} from 'flowbite-react';

const theme: CustomFlowbiteTheme['tooltip'] = {
  style: {
    dark: 'bg-neutral-950 text-white',
    light: 'border border-neutral-200 bg-white text-neutral-900'
  },
  base: 'py-1 px-2 rounded-md inline text-sm font-normal leading-tight min-w-32 max-w-96 w-max z-10',
}

export function Tooltip({content, className, children}: {
  content: string,
  className?: string | undefined
  children: React.ReactNode
}) {
  return (
    <>
      <FlowbiteTooltip
        style="light"
        theme={theme}
        content={content}
        className={className}
      >
        {children}
      </FlowbiteTooltip>
    </>
  )
}