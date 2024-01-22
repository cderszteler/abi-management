import clsx from 'clsx';
import {useId} from 'react';
import {Tooltip as ReactTooltip} from 'react-tooltip';

export function Tooltip({content, className, trigger, children}: {
  content: string,
  className?: string | undefined
  trigger?: 'hover' | 'click'
  children: React.ReactNode
}) {
  const id = useId()

  return (
    <>
      <a data-tooltip-id={id}>{children}</a>
      <ReactTooltip
        id={id}
        place='top'
        openEvents={{
          mouseenter: trigger !== 'click',
          click: trigger === 'click'
        }}
        content={content}
        className={clsx(
          '!py-1 !px-2 !rounded-md !inline !text-sm !font-normal !leading-tight min-w-32 max-w-96 w-max z-10 !opacity-100',
          '!border !border-neutral-200 !bg-white !text-neutral-900',
          className
        )}
      />
    </>
  )
}