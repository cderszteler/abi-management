'use client'

import {Container} from "@/components/Container";
import {FadeIn} from "@/components/FadeIn";
import clsx from "clsx";
import {SetStateAction, useState} from "react";
import {ActionButton, Button} from "@/components/Button";

export default function Game() {
  const first = useNamedCounter("Name 1")
  const second = useNamedCounter("Name 2")
  const third = useNamedCounter("Name 3")

  return (
    <>
      <Container className="mt-24 ">
        <FadeIn>
          <div className="w-full h-full grid grid-rows-4 grid-cols-3 gap-y-10">
            <Name name={first.name} setName={first.setName}/>
            <Name name={second.name} setName={second.setName}/>
            <Name name={third.name} setName={third.setName}/>
            <Count count={first.count}/>
            <Count count={second.count}/>
            <Count count={third.count}/>
            <Counter count={first.count} setCount={first.setCount}/>
            <Counter count={second.count} setCount={second.setCount}/>
            <Counter count={third.count} setCount={third.setCount}/>
            <Reset namedCounters={[first, second, third]}/>
          </div>
        </FadeIn>
      </Container>
    </>
  )
}

type NamedCounter = {
  name: string
  setName: React.Dispatch<SetStateAction<string>>
  count: number
  setCount: React.Dispatch<SetStateAction<number>>
}

function useNamedCounter(initialName?: string): NamedCounter {
  const [name, setName] = useState(initialName ?? "")
  const [count, setCount] = useState(0)
  return {name, setName, count, setCount}
}

function Name({name, setName}: {
  name: string,
  setName: React.Dispatch<SetStateAction<string>>
}) {
  return (
    <input
      className={clsx(
        "w-full text-center text-xl sm:text-3xl font-semibold border-0 bg-transparent",
        "rounded-md focus:ring-inset focus:ring-2 focus:ring-neutral-700"
      )}
      onChange={(event) => {
        setName(event.target.value)
      }}
      value={name}
      type="text"
    />
  )
}

function Count({count}: {count: number}) {
  return (
    <span className="w-full inline-flex items-center justify-center text-7xl sm:text-8xl font-bold row-span-2">{count}</span>
  )
}

function Counter({count, setCount}: {
  count: number,
  setCount: React.Dispatch<SetStateAction<number>>
}) {
  return (
    <div className="w-full flex items-center justify-center gap-x-2 sm:gap-x-5">
      <ActionButton
        className="!py-2 px-2 sm:!py-1 sm:px-6 text-lg font-medium bg-green-200/50 text-green-700 ring-green-500/40 shadow-green-300/80 hover:bg-green-200/80 hover:text-green-900 hover:ring-green-700/40"
        onClick={() => {
          setCount(count + 1)
        }}
      >
        + 1
      </ActionButton>
      <ActionButton
        className="!py-2 px-2 sm:!py-1 sm:px-6 text-lg font-medium bg-red-200/50 text-red-700 ring-red-500/40 shadow-red-300/80 hover:bg-red-200/80 hover:text-red-900 hover:ring-red-700/40"
        onClick={() => {
          setCount(count - 1)
        }}
      >
        - 1
      </ActionButton>
    </div>
  )
}

function Reset({namedCounters}: {namedCounters: NamedCounter[]}) {
  return (
    <div className="w-full col-span-3 flex items-center justify-center mt-5 sm:mt-10">
      <Button onClick={() => namedCounters.forEach((counter, index) => {
        counter.setName(`Name ${index + 1}`)
        counter.setCount(0)
      })}>
        Zurücksetzen
      </Button>
    </div>
  )
}