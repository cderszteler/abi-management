import clsx from 'clsx';
import {useId} from 'react';
import {Tooltip as ReactTooltip} from 'react-tooltip';

export function Tooltip({content, trigger, onClick, className, children, ...props}: {
  content: React.ReactNode,
  hidden?: boolean
  trigger?: 'hover' | 'click'
  onClick?: () => void
  className?: string | undefined
  children: React.ReactNode
}) {
  const id = useId()

  return (
    <>
      <span
        onClick={() => {
          if (onClick) {
            onClick()
          }
        }}
        data-tooltip-id={id}
        className="relative"
      >
        {children}
      </span>
      <ReactTooltip
        id={id}
        openEvents={{
          mouseenter: trigger !== 'click',
          click: trigger === 'click'
        }}
        opacity={100}
        hidden={props.hidden}
        disableStyleInjection={true}
        className={clsx(
          'py-1 px-2 rounded-md inline text-sm font-normal leading-tight min-w-16 max-w-96 w-max z-10',
          'border border-neutral-200 bg-white text-neutral-900',
          className
        )}
      >
        {content}
      </ReactTooltip>
    </>
  )
}