import {CustomFlowbiteTheme, Tooltip as FlowbiteTooltip} from 'flowbite-react';

const theme: CustomFlowbiteTheme['tooltip'] = {
  style: {
    dark: 'bg-neutral-950 text-white'
  },
  base: 'py-1 px-2 rounded-md inline text-sm font-normal leading-tight min-w-32 max-w-96 w-max z-10',
}

export function Tooltip({content, children}: {
  content: string,
  children: React.ReactNode
}) {
  return (
    <>
      <FlowbiteTooltip  theme={theme} content={content} className="font-">
        {children}
      </FlowbiteTooltip>
    </>
  )
}